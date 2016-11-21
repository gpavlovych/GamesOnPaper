import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayCrossZero'
})
export class DisplayCrossZeroPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value){
      case 0:
        return "";
      case 1:
        return "X";
      case 2:
        return "O";
    }
  }

}
