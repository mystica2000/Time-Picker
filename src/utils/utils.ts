export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}


export function isEmpty(val)
{
  if(val == undefined || val == "" || val.length==0 || val == null)
  {
    return true;
  }
  else 
  {
    return false;
  }
}