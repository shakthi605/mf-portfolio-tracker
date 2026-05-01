import {
  Component, input, OnChanges, SimpleChanges,
  ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-nav-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-wrap">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    .chart-wrap {
      position: relative;
      height: 260px;
      width: 100%;
    }
    canvas { display: block; }
  `],
})
export class NavChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('chartCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  readonly labels = input<string[]>([]);
  readonly values = input<number[]>([]);
  readonly color  = input('#1a56db');

  private chart?: Chart;

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['labels'] || changes['values']) && this.chart) {
      this.chart.data.labels  = this.labels();
      this.chart.data.datasets[0].data = this.values();
      this.chart.update('active');
    }
  }

  private buildChart(): void {
    const ctx = this.canvas.nativeElement.getContext('2d')!;
    const c   = this.color();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.labels(),
        datasets: [{
          data:            this.values(),
          borderColor:     c,
          backgroundColor: c + '18',
          borderWidth:     2,
          pointRadius:     0,
          pointHoverRadius: 5,
          fill:            true,
          tension:         0.35,
        }],
      },
      options: {
        responsive:          true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `₹${Number(ctx.raw).toFixed(4)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              maxTicksLimit: 6,
              font: { size: 11 },
              color: '#94a3b8',
            },
          },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              font: { size: 11 },
              color: '#94a3b8',
              callback: v => `₹${Number(v).toFixed(2)}`,
            },
          },
        },
      },
    });
  }
}
