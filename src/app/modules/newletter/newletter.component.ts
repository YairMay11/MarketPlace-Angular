import { Component, OnInit } from '@angular/core';
import { Path } from '../../config';

@Component({
  selector: 'app-newletter',
  templateUrl: './newletter.component.html',
  styleUrls: ['./newletter.component.css']
})
export class NewletterComponent implements OnInit {
  
  path:String = Path.url;

  constructor() { }

  ngOnInit(): void {
  }

}
