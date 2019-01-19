import { NgModule, ModuleWithProviders } from '@angular/core';
import { FixedColumnAndHeaderTableService } from './fixed-table.service';
import { FixedColumnAndHeaderTableDirective } from './fixed-table.directive';

@NgModule({
  declarations: [ FixedColumnAndHeaderTableDirective ],
  imports: [],
  exports: [ FixedColumnAndHeaderTableDirective ]
})
export class FixedColumnAndHeaderTableModule {
  static forRoot(): ModuleWithProviders<FixedColumnAndHeaderTableModule> {
    return {
      ngModule: FixedColumnAndHeaderTableModule,
      providers: [ FixedColumnAndHeaderTableService ],
    };
  }
 }
