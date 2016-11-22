import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
  private getFieldValue(value: any, field: string){
    var fields: string[] = field.split(".");
    for (var fieldItem of fields){
      value = value[fieldItem];
    }
    return value;
  }
  transform(value: Array<any>, field: string): Array<any> {
    const groupedObj = value.reduce((prev, cur) => {
      var fieldValue = this.getFieldValue(cur,field);
      if (!prev[fieldValue]) {
        prev[fieldValue] = [cur];
      } else {
        prev[fieldValue].push(cur);
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(key => ({key, value: groupedObj[key]}));
  }
}
