import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TitleResolver implements Resolve<void> {
  private readonly titleService = inject(Title);

  resolve(route: ActivatedRouteSnapshot): void {
    const title = route.data['title'] ?? 'Frontend';
    this.titleService.setTitle(`OPAL - ${title}`);
  }
}
