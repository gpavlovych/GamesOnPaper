import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayCrossZero'
})
export class DisplayCrossZeroPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value){
      case null:
        return "";
      case 0:
        return "X";
      case 1:
        return "O";
    }
  }

}
