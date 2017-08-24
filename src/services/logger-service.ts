/* tslint:disable */
import { Injectable } from '@angular/core';
import { DEBUGGABLE } from '../app/constantes';
/**
* @author Jonathan Casarrubias <twitter:@johncasarrubias> <github:@johncasarrubias>
* @module LoggerService
* @license MIT
* @description
* Console Log wrapper that can be disabled in production mode
**/
@Injectable()
export class LoggerService {

  log(...args: any[]) {
    if (DEBUGGABLE)
    console.log.apply(console, args);
  }

  info(...args: any[]) {
    if (DEBUGGABLE)
    console.info.apply(console, args);
  }

  error(...args: any[]) {
    if (DEBUGGABLE)
    console.error.apply(console, args);
  }

  count(arg: string) {
    if (DEBUGGABLE)
    console.count(arg);
  }

  group(arg: string) {
    if (DEBUGGABLE)
    console.count(arg);
  }

  groupEnd() {
    if (DEBUGGABLE)
    console.groupEnd();
  }

  profile(arg: string) {
    if (DEBUGGABLE)
    console.count(arg);
  }

  profileEnd() {
    if (DEBUGGABLE)
    console.profileEnd();
  }

  time(arg: string) {
    if (DEBUGGABLE)
    console.time(arg);
  }

  timeEnd(arg: string) {
    if (DEBUGGABLE)
    console.timeEnd(arg);
  }
}
