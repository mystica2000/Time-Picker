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
    

    hourIncrement!: HTMLSpanElement;
    hourDecrement!: HTMLSpanElement;

    minuteIncrement!:HTMLSpanElement;
    minuteDecrement!:HTMLSpanElement;

    amElement!:HTMLDivElement;
    pmElement!:HTMLDivElement;
  

    @State() meridianAM = false;
    meridian = "AM";

    highlightMeridian(str)
    {
        this.meridian = str;
        if(str == "AM")
        {
          this.isAMactive = true;
        }
        else if(str == "PM")
        {
          this.isAMactive = false;
        }
    }

    private isValidInputs(e)
    {
      if(e.type=="mousedown" || e.type=="touchstart" || (e.type=="keydown" && e.keyCode== 13)) {return true}
      return false;
    }


    private isValidOutputs(e)
    {
      if(e.type == "mouseup" || e.type == "mouseleave" || e.type=="touchend" || (e.type=="keydown" && e.keyCode!=13)) {return true;}
      return false; 
    }

    stopDefaults(e)
    {
      e.stopPropagation();
      e.preventDefault();
    }


    changeHour(e,str)
    {
      
      this.stopDefaults(e);
      this.toggleFocus(e,true)


      if(this.isValidInputs(e))
      {
        this.hourIndex = this.findMinuteIndex(this.hourValues,this.hour)
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
          this.hourIndex = this.hourIndex - 1;
          if(this.hourIndex <= 0)
          {
            this.hourIndex = this.hourValues.length-1;
          }
          
          this.isHourDownActive = true;
          this.isHourUpActive = false;
        }

        this.hour = this.hourValues[this.hourIndex];
      
          if(e.type!="keydown")
          {
            this.timeouts = setTimeout(() => {
            this.changeHour(e,str)}, 200); 
          }
      }
      else if(e.type == "keydown" && e.keyCode==9)
      {
        if(str == ChangeState.INC)
        {
          this.hourInput.focus();
        }
        else 
        {
          this.minuteIncrement.focus()
        }
      }
      else if(this.isValidOutputs(e))
      {
        this.clearTimeOuts();
      }
    }

     findMinuteIndex(arr,val)
     {
       for(let i=0;i<arr.length;i++)
       {
         if(arr[i]==val)
         {
           return i;
         }
       }
       return 0;
     }

    changeMinute(e,str)
    {
      this.stopDefaults(e);
      this.toggleFocus(e,false)
      

      if(this.isValidInputs(e))
      {  
        // change minuteIndex according to minute value
        this.minuteIndex = this.findMinuteIndex(this.minutesValues,this.minute);
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

        if(e.type!="keydown")
        {
          this.timeouts = setTimeout(() => {
          this.changeMinute(e,str)}, 200);
        }
      }
      else if(e.type == "keydown" && e.keyCode==9)
      {
        this.clearTimeOuts();
        if(str == ChangeState.INC)
        {
          this.minuteInput.focus();
        }
        else 
        {
          this.amElement.focus()
        }
      }
      else if(this.isValidOutputs(e))
      {
        this.clearTimeOuts();
      }
    }

    isHourActive = true;;
    toggleFocus(evt,val)
    {
      this.isHourActive = val;
      evt.preventDefault();
    }

    checkForCorrectInput(val):string
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
      return temp;
    }

    minuteEvent(e)
    {
      let val = e.target.value;
      if(this.checkForAlphabets.test(val)==false)
      {
        let minuteToInt = parseInt(val);

        if(minuteToInt <= 59)
        {
          let temp = this.checkForCorrectInput(val);
          this.minuteInput.value = temp;
        }
        else 
        {
          this.minuteInput.value = this.minuteInput.value.substring(0,2);
        }
      }
      else 
      {
        this.minuteInput.value = this.minuteInput.value.replace(/\D/g,'');
      }
      this.minute = this.minuteInput.value;
    }


    hourEvent(e)
    {
      let val = e.target.value;
      console.log(e)
      if(this.checkForAlphabets.test(val)==false)
      {
        let hourToInt = parseInt(val);
        if(hourToInt <= 12)
        {
          let temp = this.checkForCorrectInput(val); 
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
      this.hour = this.hourInput.value;
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

    getTime()
    {
      return this.hour + ":" + this.minute + " " + this.meridian;
    }

    render()
    {
        return (
            <div class="grid-box">
                 <div class="container" tabindex="0">
                   <span class={"hour "+ (this.isHourActive ? "bgChange":"bgChangeNormal")} tabindex="0" onClick={($evt)=> this.toggleFocus($evt,true)}>
                     <span class="triangle" tabindex="0"
                     onMouseDown={(e)=>{this.changeHour(e,ChangeState.INC)}}
                     onTouchStart={(e)=>{this.changeHour(e,ChangeState.INC)}}
                     onKeyDown={(e)=>{this.changeHour(e,ChangeState.INC)}}
                     onTouchEnd={()=>{this.clearTimeOuts()}}
                     onMouseUp={()=>{this.clearTimeOuts()}}
                     onMouseLeave={()=>{this.clearTimeOuts()}}
                     onKeyUp={()=>{this.clearTimeOuts()}}
                     onKeyPress={()=>{this.clearTimeOuts()}}
                     ref={(el) => this.hourIncrement = el as HTMLSpanElement}
                     role="button" aria-label="increment hour button"
                     >
                     <span class={ "triangle-shape "+ (this.isHourUpActive==false || this.isHourActive==false ? "triangle-up-off" : "triangle-up-on")}
                     ></span>
                     </span>
                     <span onClick={()=>{this.hourInput.focus()}} aria-label="hour input" >
                     <input class="hours" type="text" inputmode="numeric" value={this.hour} onInput={(e)=>{this.hourEvent(e)}}
                     aria-label="input hours"
                     ref={(el) => this.hourInput = el as HTMLInputElement}
                     onClick={()=>{this.moveCursorToEnd(this.hourInput)}}/>
                     </span>
                     <span class="triangle" role="button" tabindex="0"
                     onMouseDown={(e)=>{this.changeHour(e,ChangeState.DEC)}}
                     onTouchStart={(e)=>{this.changeHour(e,ChangeState.DEC)}}
                     onKeyDown={(e)=>{this.changeHour(e,ChangeState.DEC)}}
                     onTouchEnd={()=>{this.clearTimeOuts()}}
                     onMouseUp={()=>{this.clearTimeOuts()}}
                     ref={(el) => this.hourDecrement = el as HTMLSpanElement}
                     onMouseLeave={()=>{this.clearTimeOuts()}} aria-label="decrement hour button">
                     <span class={"triangle-shape "+ (this.isHourDownActive==false || this.isHourActive==false ? "triangle-down-off":"triangle-down-on")}></span>
                     </span>
                   </span>
                   <span class="column">:</span>
                   <span class={"minutes "+ (!this.isHourActive ? "bgChange":"bgChangeNormal")} tabindex="0" onClick={($evt)=> this.toggleFocus($evt,false)}>
                   <span class="triangle" role="button" aria-label="increment minute button"
                   onMouseDown={(e)=>{this.changeMinute(e,ChangeState.INC)}}
                   onTouchStart={(e)=>{this.changeMinute(e,ChangeState.INC)}}
                   onKeyDown={(e)=>{this.changeMinute(e,ChangeState.INC)}}
                   onTouchEnd={()=>{this.clearTimeOuts()}}
                   onMouseUp={()=>{this.clearTimeOuts()}}
                   onMouseLeave={()=>{this.clearTimeOuts()}} tabindex="0" 
                   ref={(el) => this.minuteIncrement = el as HTMLSpanElement}>
                     <span class={"triangle-shape "+ (this.isMinuteUpActive==false || this.isHourActive==true ? "triangle-up-off":"triangle-up-on")}></span>
                     </span>
                     <input class="hours" type="text" inputmode="numeric" value={this.minute} onInput={(e)=>{this.minuteEvent(e)}}
                     ref={(el) => this.minuteInput = el as HTMLInputElement}
                     onClick={()=>{this.moveCursorToEnd(this.minuteInput)}}
                     aria-label="input minute"/>
                     <span class="triangle" role="button"
                     onMouseDown={(e)=>{this.changeMinute(e,ChangeState.DEC)}}
                     onTouchStart={(e)=>{this.changeMinute(e,ChangeState.DEC)}}
                     onTouchEnd={()=>{this.clearTimeOuts()}}
                     onKeyDown={(e)=>{this.changeMinute(e,ChangeState.DEC)}}
                     onMouseUp={()=>{this.clearTimeOuts()}}
                     ref={(el) => this.minuteDecrement = el as HTMLSpanElement}
                     onMouseLeave={()=>{this.clearTimeOuts()}} tabindex="0"
                     aria-label="decrement minute button">
                     <span class={"triangle-shape "+ (this.isMinuteDownActive==false || this.isHourActive==true ? "triangle-down-off":"triangle-down-on")}></span>
                     </span>
                   </span>
                   <div class="meridiem">
                     <div role="button" class={"meridiem-child " + (this.isAMactive==true ? "bgChange":"bgChangeNormal")} onClick={()=> this.highlightMeridian("AM")}
                     onKeyPress={(e)=>{if(e.key === 'Enter'){this.highlightMeridian("AM")}}} tabindex="0"
                     aria-label="AM button" ref={(el) => this.amElement = el as HTMLDivElement}>
                       <div>AM</div></div>
                     <div role="button" aria-label="PM button" ref={(el) => this.pmElement = el as HTMLDivElement}
                     onKeyPress={(e)=>{if(e.key === 'Enter'){this.highlightMeridian("PM")}}}
                     class={"meridiem-child " +(this.isAMactive==false ? "bgChange":"bgChangeNormal")} onClick={()=> this.highlightMeridian("PM")} tabindex="0">
                       <div>PM</div></div>
                   </div>
                 </div>
                 <div tabindex="0">Time is: {this.getTime()}</div>
            </div>
        );
    }
}