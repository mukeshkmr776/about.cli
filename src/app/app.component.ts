import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit, OnDestroy {

  PROMPT = "mukki@localhost ~$";
  input = '';
  enableInput = true;
  MAX_LENGTH = 20;
  MAX_HISTORYTABLE_LENGTH = 17;

  historyTable = [];
  historySchema = {type: '', value: ''};

  @ViewChild('container') private containerRef: ElementRef;

  blinkingFinger = true;

  cursor = true;
  interval = null;
  ctx = {cursor: true};

  SUPPORTED_KEYPRESS_CODES = [];
  ALPHABET_CODES_UPPERCASE = {min: 65, max: 90};
  ALPHABET_CODES_LOWERCASE = {min: 97, max: 122};
  NUMBER_CODES_DIGIT = {min: 48, max: 57};
  WHITESPACE_CODE = 32;
  BACKSPACE_CODE = 8;
  ENTER_CODE = 13;
  DOT_CODE = 190;


  ITEMS_CONTENT = {
    'about.txt': 'hello world :)',
    'skills.txt': 'Node.js    Angular    Cloud    WebSocket',
    'links.txt': 'https://github.com/mukeshkmr776',
    'projects.txt': ['MicrosoftAzure (DataFactory) - 5 Months', 'IBM PowerHA - 4 Years', 'IBM VMRestart - 6 Months', 'IBM Storwize - 7 Months', 'Self learning - infinity']
  }
  ITEMS = Object.keys(this.ITEMS_CONTENT);


  COMMANDS = {
    BLANK: '',
    CAT: 'cat',
    CLEAR: 'clear',
    HELP: 'help',
    LIST: 'ls'
  };

  // Only AlphaNumeric
  @HostListener('window:keydown', ['$event'])
  keyPressAlphaNumeric(event) {
    // console.clear();

    const { keyCode, code } = event;
    const charCode = String.fromCharCode(keyCode);

    console.log(`keyCode=${keyCode} code=${code} charCode=${charCode}`);

    if(!this.enableInput) {
      return true;
    }

    if ((this.input.length > this.MAX_LENGTH - 1) && keyCode !== this.BACKSPACE_CODE && keyCode !== this.ENTER_CODE) {
      return true;
    }

    if ((keyCode >= this.ALPHABET_CODES_LOWERCASE.min && keyCode <= this.ALPHABET_CODES_LOWERCASE.max) || (keyCode >= this.ALPHABET_CODES_UPPERCASE.min && keyCode <= this.ALPHABET_CODES_UPPERCASE.max)) {
      this.input += String(charCode).toLowerCase();
      return true;
    } else if (keyCode >= this.NUMBER_CODES_DIGIT.min && keyCode <= this.NUMBER_CODES_DIGIT.max) {
      this.input += String(charCode).toLowerCase();
      return true;
    } else if (keyCode === this.BACKSPACE_CODE) {
      this.input = this.input.slice(0, -1);
      return true;
    } else if (keyCode === this.WHITESPACE_CODE) {
      this.input += ' ';
      return true;
    } else if (keyCode === this.DOT_CODE) {
      this.input += '.';
      return true;
    } else if (keyCode === this.ENTER_CODE) {
      this.OnEnterKeyPress(this.input);
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  OnEnterKeyPress(input: string) {
    this.enableInput = false;

    this.historySchema = {type: 'command', value: input};
    this.historyTable.push(this.historySchema);
    this.input = '';

    const [command, parameter] = input.trim().length > 0 ? input.trim().split(' ').filter(val => val) : [''];

    switch (command) {
      case this.COMMANDS.CLEAR:
        this.historyTable = [];
        break;

      case this.COMMANDS.BLANK:
        break;

      case this.COMMANDS.LIST:
        this.historyTable.push({type: 'output', value: this.ITEMS.join(' '.repeat(4))});
        break;

      case this.COMMANDS.CAT:
        if (this.ITEMS.includes(parameter)) {
          if (Array.isArray(this.ITEMS_CONTENT[parameter])) {
            this.ITEMS_CONTENT[parameter].forEach(val => {
              this.historyTable.push({type: 'output', value: val});
            });
          } else {
            this.historyTable.push({type: 'output', value: this.ITEMS_CONTENT[parameter]});
          }
        } else {
          this.historyTable.push({type: 'output', value: `no file found "${parameter}"`});
        }
        break;

      case this.COMMANDS.HELP:
        this.historyTable.push({type: 'output', value: 'Supported commands: ls, cat, clear, help'});
        break;

      default:
        this.historyTable.push({type: 'output', value: `Invalid command "${command}".`});
        break;
    }

    // Delete history if more than length.
    while (this.historyTable.length > this.MAX_HISTORYTABLE_LENGTH - 2) {
      this.historyTable.shift();
    }

    // this.scrollToBottom()
    this.enableInput = true;
  }

  scrollToBottom() {
    this.containerRef.nativeElement.scroll({
      left: 0,
      top: this.containerRef.nativeElement.scrollHeight,
      behavior: 'smooth'
    });
  }

  ngAfterViewInit() {
    this.interval = setInterval(() => {
      this.cursor = !this.cursor;
    }, 400);
    setInterval(() => {
      this.blinkingFinger = !this.blinkingFinger;
    }, 350);
  }

  ngOnDestroy() {
    this.interval !== null ? clearInterval(this.interval) : null;
  }

}
