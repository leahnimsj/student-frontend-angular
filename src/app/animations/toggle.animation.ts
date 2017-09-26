import {  trigger, state, animate, transition, style } from '@angular/core';


export const toggleAnimation =
    trigger('toggleState', [
    // What happens when toggleState is true
      state('true' , style({ maxHeight: '200px' })),
      // What happens when toggleState is false
      state('false', style({ maxHeight: 0, padding: 0, display: 'none' }))
    ])