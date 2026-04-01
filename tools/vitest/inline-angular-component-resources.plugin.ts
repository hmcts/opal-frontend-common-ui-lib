import typescript from 'typescript';
import { normalizePath, type Plugin } from 'vite';

type ComponentDecoratorImports = {
  identifiers: Set<string>;
  namespaces: Set<string>;
};

export function inlineAngularComponentResourcesPlugin(projectRoot: string): Plugin {
  const normalizedProjectRoot = normalizePath(projectRoot);

  return {
    name: 'opal:inline-angular-component-resources',
    enforce: 'pre',
    transform(source, id) {
      const normalizedId = normalizePath(id);

      if (!shouldTransform(normalizedId, normalizedProjectRoot, source)) {
        return null;
      }

      const sourceFile = typescript.createSourceFile(
        normalizedId,
        source,
        typescript.ScriptTarget.Latest,
        true,
        typescript.ScriptKind.TS,
      );
      const componentDecoratorImports = getComponentDecoratorImports(sourceFile);

      if (componentDecoratorImports.identifiers.size === 0 && componentDecoratorImports.namespaces.size === 0) {
        return null;
      }

      let changed = false;

      const result = typescript.transform(sourceFile, [
        (context) => {
          const { factory } = context;
          const resourceImports: typescript.ImportDeclaration[] = [];
          let resourceIndex = 0;

          const nextResourceImport = (specifier: string) => {
            const identifier = factory.createIdentifier(`__opalVitestResource${resourceIndex}`);
            resourceIndex += 1;

            resourceImports.push(
              factory.createImportDeclaration(
                undefined,
                factory.createImportClause(false, identifier, undefined),
                factory.createStringLiteral(specifier),
                undefined,
              ),
            );

            return identifier;
          };

          const visitNode = (node: typescript.Node): typescript.Node => {
            if (typescript.isClassDeclaration(node)) {
              const decorators = typescript.getDecorators(node);

              if (!decorators || decorators.length === 0) {
                return node;
              }

              return factory.updateClassDeclaration(
                node,
                [
                  ...decorators.map((decorator) =>
                    visitDecorator(factory, decorator, componentDecoratorImports, nextResourceImport, () => {
                      changed = true;
                    }),
                  ),
                  ...(typescript.getModifiers(node) ?? []),
                ],
                node.name,
                node.typeParameters,
                node.heritageClauses,
                node.members,
              );
            }

            return typescript.visitEachChild(node, visitNode, context);
          };

          return (currentSourceFile) => {
            const updatedSourceFile = typescript.visitEachChild(currentSourceFile, visitNode, context);

            if (resourceImports.length === 0) {
              return updatedSourceFile;
            }

            return factory.updateSourceFile(
              updatedSourceFile,
              typescript.setTextRange(
                factory.createNodeArray([...resourceImports, ...updatedSourceFile.statements]),
                updatedSourceFile.statements,
              ),
              updatedSourceFile.isDeclarationFile,
              updatedSourceFile.referencedFiles,
              updatedSourceFile.typeReferenceDirectives,
              updatedSourceFile.hasNoDefaultLib,
              updatedSourceFile.libReferenceDirectives,
            );
          };
        },
      ]);

      if (!changed) {
        return null;
      }

      const printer = typescript.createPrinter({ newLine: typescript.NewLineKind.LineFeed });

      return {
        code: printer.printFile(result.transformed[0] as typescript.SourceFile),
        map: null,
      };
    },
  };
}

function shouldTransform(id: string, projectRoot: string, source: string): boolean {
  return (
    id.startsWith(projectRoot) &&
    id.endsWith('.ts') &&
    !id.endsWith('.d.ts') &&
    !id.endsWith('.spec.ts') &&
    !id.endsWith('.test.ts') &&
    !id.includes('/node_modules/') &&
    (source.includes('templateUrl') || source.includes('styleUrl') || source.includes('styleUrls'))
  );
}

function getComponentDecoratorImports(sourceFile: typescript.SourceFile): ComponentDecoratorImports {
  const identifiers = new Set<string>();
  const namespaces = new Set<string>();

  for (const statement of sourceFile.statements) {
    if (!typescript.isImportDeclaration(statement) || !typescript.isStringLiteral(statement.moduleSpecifier)) {
      continue;
    }

    if (statement.moduleSpecifier.text !== '@angular/core') {
      continue;
    }

    const importClause = statement.importClause;

    if (!importClause?.namedBindings) {
      continue;
    }

    if (typescript.isNamedImports(importClause.namedBindings)) {
      for (const element of importClause.namedBindings.elements) {
        const importedName = element.propertyName?.text ?? element.name.text;

        if (importedName === 'Component') {
          identifiers.add(element.name.text);
        }
      }

      continue;
    }

    namespaces.add(importClause.namedBindings.name.text);
  }

  return { identifiers, namespaces };
}

function visitDecorator(
  factory: typescript.NodeFactory,
  decorator: typescript.Decorator,
  componentDecoratorImports: ComponentDecoratorImports,
  nextResourceImport: (specifier: string) => typescript.Identifier,
  markChanged: () => void,
): typescript.Decorator {
  if (!typescript.isCallExpression(decorator.expression)) {
    return decorator;
  }

  if (!isComponentDecoratorExpression(decorator.expression.expression, componentDecoratorImports)) {
    return decorator;
  }

  const [metadata] = decorator.expression.arguments;

  if (!metadata || !typescript.isObjectLiteralExpression(metadata)) {
    return decorator;
  }

  const properties: typescript.ObjectLiteralElementLike[] = [];
  const externalStyles: typescript.Expression[] = [];
  let originalStyles: typescript.PropertyAssignment | undefined;
  let decoratorChanged = false;

  for (const property of metadata.properties) {
    if (!typescript.isPropertyAssignment(property) || typescript.isComputedPropertyName(property.name)) {
      properties.push(property);
      continue;
    }

    const propertyName = property.name.text;

    if (propertyName === 'templateUrl' && typescript.isStringLiteralLike(property.initializer)) {
      decoratorChanged = true;
      properties.push(
        factory.updatePropertyAssignment(
          property,
          factory.createIdentifier('template'),
          nextResourceImport(`${property.initializer.text}?raw`),
        ),
      );
      continue;
    }

    if (propertyName === 'styleUrl' && typescript.isStringLiteralLike(property.initializer)) {
      decoratorChanged = true;
      externalStyles.push(nextResourceImport(`${property.initializer.text}?inline`));
      continue;
    }

    if (propertyName === 'styleUrls' && typescript.isArrayLiteralExpression(property.initializer)) {
      decoratorChanged = true;

      for (const element of property.initializer.elements) {
        if (typescript.isStringLiteralLike(element) && element.text.length > 0) {
          externalStyles.push(nextResourceImport(`${element.text}?inline`));
        }
      }

      continue;
    }

    if (propertyName === 'styles') {
      originalStyles = property;
      continue;
    }

    properties.push(property);
  }

  if (!decoratorChanged) {
    return decorator;
  }

  markChanged();

  const stylesProperty =
    externalStyles.length > 0
      ? factory.createPropertyAssignment(
          factory.createIdentifier('styles'),
          factory.createArrayLiteralExpression([...getExistingStyleExpressions(originalStyles), ...externalStyles]),
        )
      : originalStyles;

  if (stylesProperty) {
    properties.push(stylesProperty);
  }

  return factory.updateDecorator(
    decorator,
    factory.updateCallExpression(
      decorator.expression,
      decorator.expression.expression,
      decorator.expression.typeArguments,
      [factory.updateObjectLiteralExpression(metadata, properties)],
    ),
  );
}

function isComponentDecoratorExpression(
  expression: typescript.LeftHandSideExpression,
  componentDecoratorImports: ComponentDecoratorImports,
): boolean {
  if (typescript.isIdentifier(expression)) {
    return componentDecoratorImports.identifiers.has(expression.text);
  }

  return (
    typescript.isPropertyAccessExpression(expression) &&
    typescript.isIdentifier(expression.expression) &&
    componentDecoratorImports.namespaces.has(expression.expression.text) &&
    expression.name.text === 'Component'
  );
}

function getExistingStyleExpressions(
  originalStyles: typescript.PropertyAssignment | undefined,
): typescript.Expression[] {
  if (!originalStyles) {
    return [];
  }

  const { initializer } = originalStyles;

  if (typescript.isArrayLiteralExpression(initializer)) {
    return [...initializer.elements];
  }

  return [initializer];
}
