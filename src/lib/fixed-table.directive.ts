import { OnInit, Input, OnDestroy, Output, Directive, HostListener } from '@angular/core';
import { EventEmitter } from 'events';
import { FixedColumnAndHeaderTableService } from './fixed-table.service';

import * as _jQuery from 'jquery';
const $ = (_jQuery as any).default || _jQuery;


@Directive({
  selector: '[fixed-table]',
})
export class FixedColumnAndHeaderTableDirective implements OnInit, OnDestroy {

  @Input('fixed-header')
  fixedHeader: boolean = true;

  @Input('fixed-column')
  fixedColumn: boolean = true;

  @Input('offset-top')
  offsetTop: string = "";

  @Input('offset-left')
  offsetLeft: string = "";  

  @Input('default-height')
  defaultHeight: string = "";


  @Output()
  sorted = new EventEmitter();

  private listening: boolean = true;
  private _offsetTop: number;
  private _offsetLeft: number;
  private _defaultHeight: number = 82;

  private _lastScrollTop: number = 0;
  private _lastScrollLeft: number = 0;
  private _firefoxOffset: number = 0;

  

  /**
   * 
   * @param service 
   */
  constructor(private service: FixedColumnAndHeaderTableService) { 

  }

  @HostListener('window:resize', ['$event'])
  onWindowResize($event: Event) {
    let document = $event.target;
    if(document)
      this.refreshTable(document['scrollY'], document['scrollX']);
  }

  /**
   * Listen for scroll events
   * @param $event 
   */
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event: Event) {
    let document = $event.target['scrollingElement'];
    if(document)
      this.refreshTable(document.scrollTop, document.scrollLeft);
  }

  /**
   * 
   */
  public redraw(): void {

    /* Clone the table */
    if($('#fixed-table-column').length > 0) {
      $('#fixed-table-column').empty();
    }

    if(this.fixedColumn) {

      $('[fixed-table] [fixed-column]').css({ 'visibility': 'visible' })

      let fixedTable = $('[fixed-table]').first();
      let fixedColumns = fixedTable.find('[fixed-column]').clone();

      

      // Create New Table
      let fixedColumnTable = fixedTable.parent().append('<table _ngcontent-c8 border-spacing="3" id="fixed-table-column" class="calendar-view-month"></table>').find('#fixed-table-column').first();
      let fixedColumnTableHead = fixedColumnTable.append('<thead _ngcontent-c8></thead>').find('thead').first();
      let fixedColumnTableBody = fixedColumnTable.append('<tbody _ngcontent-c8></tbody>').find('tbody').first();;
      for(let i = 0; i < fixedColumns.length; i++) {
        if(fixedColumns[i].nodeName == 'TH') {
          let fixedRow = fixedColumnTableHead.append('<tr fixed-column-index="'+i+'" _ngcontent-c8 class="ng-star-inserted"></tr>').find('[fixed-column-index="' + i + '"]').first();
          fixedRow.append(fixedColumns[i]);
        } else if (fixedColumns[i].nodeName == 'TD') {
          let fixedRow = fixedColumnTableBody.append('<tr fixed-column-index="'+i+'" _ngcontent-c8 class="ng-star-inserted"></tr>').find('[fixed-column-index="' + i + '"]').first();
          fixedRow.append(fixedColumns[i]);
        }
      }

      /* OffsetTop */
      let offsetTop: number = 0;
      $(fixedTable).parents().each((i, element) => {
        offsetTop += element.offsetTop;
      })

      fixedColumnTable.css({
        'display': 'none',
        'position': 'fixed',
        'left': this._offsetLeft + 'px',
        'top': offsetTop - 22 + 'px',
      })
    }

    this.refreshTable(this._lastScrollTop, this._lastScrollLeft);
  }

  /**
   * 
   * @param top 
   * @param left 
   */
  refreshTable(top: number, left: number): void {

    let table = $('[fixed-table]').first();
    let head = $('[fixed-table] thead').first();

    /* Border Spacing */
    let borderSpacingHeight: number = 0;
    let borderSpacingArray = table.css('border-spacing') ? table.css('border-spacing').replace(/px/g, '').split(' ') : '0 0'.split(' ');
    if(borderSpacingArray.length == 1) {
      borderSpacingHeight = parseInt(borderSpacingArray[0]);
    }
    else if(borderSpacingArray.length == 2) {
      borderSpacingHeight = parseInt(borderSpacingArray[1]);
    }

    /* OffsetTop */
    let offsetTopStart: number = 0;
    let offsetTop: number = 0;
    let offsetHead: number = 0;
    $(table).parents().each((i, element) => {
      offsetTop += element.offsetTop;
      offsetTopStart += element.offsetTop;
    })
    $(head).children('tr').each((i, element) => {
      offsetHead += element.clientHeight;
    })
    
    // Is fixed column enabled?
    if(this.fixedColumn) {
      let fixedColumnTable = $('#fixed-table-column').first();
      let hasScrolled = !(top + this._offsetTop + borderSpacingHeight * 2 < (offsetTopStart));
      fixedColumnTable.css({
        'display': left == 0 ? 'none' : 'inline',
        'position': 'fixed',
        'left': this._offsetLeft + 'px',
        'top': hasScrolled ? offsetTop - offsetHead - 23 - top + this._firefoxOffset + 'px' : offsetTop - 20 - top + this._firefoxOffset + 'px',
      })
      $('[fixed-table] [fixed-column]').css({
        'visibility': left > 0 ? 'hidden' : 'visible'
      })
    }

    // Top Scrolling for header.
    if(head.length == 1) {
      if(top + this._offsetTop + borderSpacingHeight * 2 < (offsetTopStart)) {
        head[0].style.position = 'relative';
        head[0].style.left = '0px';
        head[0].style.top = '0px';
      } else {
        head[0].style.left = (this._offsetLeft - left) + 'px';
        head[0].style.top = (this._offsetTop) + 'px';
        head[0].style.zIndex = '10';
        head[0].style.position = 'fixed';
      }
    }

    this._lastScrollLeft = left;
    this._lastScrollTop = top;
  }

  /**
   * 
   */
  ngOnInit() {
    if(this.offsetLeft != "")
      this._offsetLeft = parseInt(this.offsetLeft)
    if(this.offsetTop != "")
      this._offsetTop = parseInt(this.offsetTop)
    if(this.defaultHeight != "")
      this._defaultHeight = parseInt(this.defaultHeight);

    if (navigator.userAgent.indexOf("Firefox") > 0) {
      this._firefoxOffset = 39;
    } else if (navigator.userAgent.indexOf("Edge") > 0) {
    } else if (navigator.userAgent.indexOf("MSIE") > 0) {
      this.fixedColumn = false;
    }
  }

  /**
   * 
   */
  ngOnDestroy() {
    $('#fixed-table-column').remove();
    /*
    console.groupCollapsed('FixedColumnAndHeaderTable');
    console.log('ngOnDestroy()');
    console.groupEnd();
    */
  }

}
