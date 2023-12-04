import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

interface IItem {
  id: string;
  value: string;
  row: number;
  col: number;
  i: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  maxrows = 9;
  maxcols = 19;

  data: IItem[][] = [];

  items = ['🩴', '👖', '🩲', '🧦']; // '👙','👔' ,'🥾', '👢', '🎩', '🧥'

  focused: string[] = [];

  isFocused(id: string) {
    return this.focused.includes(id);
  }

  constructor() {
    for (let r = 0; r <= this.maxrows; r++) {
      const row: IItem[] = [];
      for (let c = 0; c <= this.maxcols; c++) {
        const i = Math.floor(Math.random() * 4);
        const itemObj = {
          id: r + '_' + c,
          value: this.items[i],
          row: r,
          col: c,
          i: i,
        };
        row.push(itemObj);
      }
      this.data.push(row);
    }
  }

  focus(cell: IItem) {
    this.focused = [];
    this.focused.push(cell.id);
    this.checkNeigbours(cell.row, cell.col);
  }

  checkNeigbours(rowIndex: number, colIndex: number, src = '') {
    // console.log(rowIndex, colIndex, src);
    this.checkVert(rowIndex, colIndex);
    this.checkHor(rowIndex, colIndex);
  }

  checkVert(rowIndex: number, start: number) {
    const ref = this.data[rowIndex][start];

    if (start - 1 >= 0) {
      const left = this.data[rowIndex][start - 1];
      if (left && !this.isFocused(left.id)) {
        if (left.i === ref.i) {
          this.focused.push(left.id);
          this.checkNeigbours(rowIndex, left.col, 'left');
        }
      }
    }

    if (start + 1 <= this.maxcols) {
      const right = this.data[rowIndex][start + 1];
      if (right && !this.isFocused(right.id)) {
        if (right.i === ref.i) {
          this.focused.push(right.id);
          this.checkNeigbours(rowIndex, right.col, 'right');
        }
      }
    }
  }

  checkHor(start: number, colIndex: number) {
    const ref = this.data[start][colIndex];
    if (start - 1 >= 0) {
      const top = this.data[start - 1][colIndex];
      if (top && !this.isFocused(top.id)) {
        if (top.i === ref.i) {
          this.focused.push(top.id);
          this.checkNeigbours(top.row, colIndex, 'top');
        }
      }
    }
    if (start + 1 <= this.maxrows) {
      const bottom = this.data[start + 1][colIndex];
      if (bottom && !this.isFocused(bottom.id)) {
        if (bottom.i === ref.i) {
          this.focused.push(bottom.id);
          this.checkNeigbours(bottom.row, colIndex, 'bottom');
        }
      }
    }
  }

  kick() {
    if (this.focused.length >= 2) {
      this.focused.forEach((id) => {
        const [row, col] = id.split('_');
        this.data[parseInt(row, 10)][parseInt(col, 10)] = undefined;
      });
    }
  }
}
