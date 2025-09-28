import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@NgModule({
  declarations: [],
  imports: [CommonModule, BaseChartDirective],
  exports: [BaseChartDirective],
})
export class ChartModule {}
