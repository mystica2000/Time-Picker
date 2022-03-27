import { Component,h, State } from "@stencil/core";
import { ChangeState } from "../../utils/constant";

@Component({
    tag:'custom-time',
    styleUrl:'time.css',
    shadow:true
})
export class Time
{

    hourValues = ["00","01","02","03","04","05","06","07","08","09","10","11","12"]
    minutesValues = []
    hourIndex = 0;
    minuteIndex = 0;

    regexHour = new RegExp('^0{1,2}[0-9]{1,2}')
    checkForAlphabets = new RegExp('[a-zA-z]')




    timeouts: null | ReturnType<typeof setTimeout> = null;


    componentWillLoad()
    {
      let N=60,i=0;
      while(i<N)
      {
        if(i<10)
        {
          this.minutesValues.push('0'+i)
        }
        else 
        {
          this.minutesValues.push(i+'');
        }
        i++;
      }
    }
    

    @State() hour = "00";
    @State() minute = "00";

    isHourUpActive = false;
    isHourDownActive = false;

    isMinuteUpActive = false;
    isMinuteDownActive = false;

    @State() isAMactive = true;

    hourInput!: HTMLInputElement;
    minuteInput!: HTMLInputElement;

    leftTopTriangle!: HTMLDivElement;
  

    @State() meridianAM = false;

    highlightMeridian(str)
    {
        if(str == "AM")
        {
          this.isAMactive = true;
        }
        else if(str == "PM")
        {
          this.isAMactive = false;
        }
    }


    changeHour(e,str)
    {
      e.stopPropagation();
      e.preventDefault();
      
      this.toggleFocus(e,true)
      if(e.type=="mousedown" || e.type=="touchstart")
      {
      if(str == ChangeState.INC) // Increment 
      {
        this.hourIndex = this.hourIndex + 1;
        if(this.hourIndex >= this.hourValues.length)
        {
          this.hourIndex = 0;
        }
        this.isHourUpActive = true;
        this.isHourDownActive = false;
      }
      else if(str == ChangeState.DEC) // Decrement
      {
        this.isHourDownActive = true;
        this.isHourUpActive = false;
        this.hourIndex = this.hourIndex - 1;
        if(this.hourIndex <= 0)
        {
          this.hourIndex = this.hourValues.length-1;
        }
      }

      this.hour = this.hourValues[this.hourIndex];
      
      this.timeouts = setTimeout(
          () => {
            this.changeHour(e,str)}, 200);
      }
      else if(e.type == "mouseup" || e.type == "mouseleave" || e.type=="touchend")
      {
        this.clearTimeOuts();
      }
     }

    changeMinute(e,str)
    {
      e.stopPropagation();
      e.preventDefault();
      if(e.type=="mousedown" || e.type=="touchstart")
      {
        
      this.toggleFocus(e,false)
      if(str == ChangeState.INC)
      {
        this.minuteIndex = this.minuteIndex + 1;
        if(this.minuteIndex>= this.minutesValues.length)
        {
          this.minuteIndex = 0;
        }
        this.isMinuteUpActive = true;
        this.isMinuteDownActive = false;
      }
      else if(str == ChangeState.DEC)
      {
        this.minuteIndex = this.minuteIndex - 1;
        if(this.minuteIndex<=0)
        {
          this.minuteIndex = this.minutesValues.length - 1;
        }
        this.isMinuteUpActive = false;
        this.isMinuteDownActive = true;
      }
      this.minute = this.minutesValues[this.minuteIndex]

      
      this.timeouts = setTimeout(
        () => {
          this.changeMinute(e,str)}, 200);

      
      }
      else if(e.type == "mouseup" || e.type == "mouseleave" || e.type=="touchend")
      {
        this.clearTimeOuts();
      }
    }

    isHourActive = true;;
    toggleFocus(evt,val)
    {
      this.isHourActive = val;
      evt.stopPropagation()
      evt.preventDefault();

    }

    minuteEvent(e)
    {
      let val = e.target.value;
      if(this.checkForAlphabets.test(val)==false)
      {
        let minuteToInt = parseInt(val);

        if(minuteToInt <= 59)
        {
          let temp = "";
          if(val.length > 2)
          {
            // shift focus to minutes
            if(this.regexHour.test(val)) // 002,003
            {
              temp = val.substring(1);
            }   
          }
          else if(val.length<2)
          {
          temp = "0" + val;
          }
          this.minuteInput.value = temp;
        }
        else 
        {
          this.minuteInput.value = this.minuteInput.value.substring(0,2);

        }
      }
      else 
      {
        this.hourInput.value = this.hourInput.value.replace(/\D/g,'');
      }
    }


    hourEvent(e)
    {
      let val = e.target.value;

      if(this.checkForAlphabets.test(val)==false)
      {

        let hourToInt = parseInt(val);
        if(hourToInt <= 12)
        {
          let temp = ""
          if(val.length > 2)
          {
            // shift focus to minutes
            if(this.regexHour.test(val)) // 002,003
            {
              temp = val.substring(1);
            }
          }
          else if(val.length<2)
          {
            temp = "0" + val;
          }  
          this.hourInput.value = temp;
       }
       else 
       {
         this.hourInput.value = this.hourInput.value.substring(0,2);
         this.minuteInput.focus();
       }
      }
      else 
      {
        this.hourInput.value = this.hourInput.value.replace(/\D/g,'');
      }
    }

    moveCursorToEnd(el)
    {
      el.setSelectionRange(-1, -1);
      return el
    }

    clearTimeOuts()
    {
      clearTimeout(this.timeouts);
    }

    render()
    {
        return (
            <div class="grid-box">
                 <div class="container">
                   <span class={"hour "+ (this.isHourActive ? "bgChange":"bgChangeNormal")} tabindex="0" onMouseDown={($evt)=> this.toggleFocus($evt,true)}>
                     <span class="triangle" onMouseDown={(e)=>{this.changeHour(e,ChangeState.INC)}}
                     onTouchStart={(e)=>{this.changeHour(e,ChangeState.INC)}}
                     onTouchEnd={(e)=>{this.changeHour(e,ChangeState.INC)}}
                     onMouseUp={(e)=>{this.changeHour(e,ChangeState.INC)}}
                     onMouseLeave={(e)=>{this.changeHour(e,ChangeState.INC)}}
                     >
                     <span class={ "triangle-shape "+ (this.isHourUpActive==false || this.isHourActive==false ? "triangle-up-off" : "triangle-up-on")}></span>
                     </span>
                     <input class="hours" type="text" inputmode="numeric" value={this.hour} onInput={(e)=>{this.hourEvent(e)}}
                     ref={(el) => this.hourInput = el as HTMLInputElement}
                     onClick={()=>{this.moveCursorToEnd(this.hourInput)}}/>
                     <span class="triangle"
                     onMouseDown={(e)=>{this.changeHour(e,ChangeState.DEC)}}
                     onTouchStart={(e)=>{this.changeHour(e,ChangeState.DEC)}}
                     onTouchEnd={(e)=>{this.changeHour(e,ChangeState.DEC)}}
                     onMouseUp={(e)=>{this.changeHour(e,ChangeState.DEC)}}
                     onMouseLeave={(e)=>{this.changeHour(e,ChangeState.DEC)}} >
                     <span class={"triangle-shape "+ (this.isHourDownActive==false || this.isHourActive==false ? "triangle-down-off":"triangle-down-on")}></span>
                     </span>
                   </span>
                   <span class="column">:</span>
                   <span class={"minutes "+ (!this.isHourActive ? "bgChange":"bgChangeNormal")} tabindex="0" onClick={($evt)=> this.toggleFocus($evt,false)}>
                   <span class="triangle" 
                   onMouseDown={(e)=>{this.changeMinute(e,ChangeState.INC)}}
                   onTouchStart={(e)=>{this.changeMinute(e,ChangeState.INC)}}
                   onTouchEnd={(e)=>{this.changeMinute(e,ChangeState.INC)}}
                   onMouseUp={(e)=>{this.changeMinute(e,ChangeState.INC)}}
                   onMouseLeave={(e)=>{this.changeMinute(e,ChangeState.INC)}} >
                     <span class={"triangle-shape "+ (this.isMinuteUpActive==false || this.isHourActive==true ? "triangle-up-off":"triangle-up-on")}></span>
                     </span>
                     <input class="hours" type="text" inputmode="numeric" value={this.minute} onInput={(e)=>{this.minuteEvent(e)}}
                     ref={(el) => this.minuteInput = el as HTMLInputElement}
                     onClick={()=>{this.moveCursorToEnd(this.minuteInput)}}/>
                     <span class="triangle"
                     onMouseDown={(e)=>{this.changeMinute(e,ChangeState.DEC)}}
                     onTouchStart={(e)=>{this.changeMinute(e,ChangeState.DEC)}}
                     onTouchEnd={(e)=>{this.changeMinute(e,ChangeState.DEC)}}
                     onMouseUp={(e)=>{this.changeMinute(e,ChangeState.DEC)}}
                     onMouseLeave={(e)=>{this.changeMinute(e,ChangeState.DEC)}}>
                     <span class={"triangle-shape "+ (this.isMinuteDownActive==false || this.isHourActive==true ? "triangle-down-off":"triangle-down-on")}></span>
                     </span>
                   </span>
                   <div class="meridiem">
                     <div class={"meridiem-child " + (this.isAMactive==true ? "bgChange":"bgChangeNormal")} onClick={()=> this.highlightMeridian("AM")}>
                       <div>AM</div></div>
                     <div class={"meridiem-child " +(this.isAMactive==false ? "bgChange":"bgChangeNormal")} onClick={()=> this.highlightMeridian("PM")}>
                       <div>PM</div></div>
                   </div>
                 </div>
            </div>
        );
    }
}