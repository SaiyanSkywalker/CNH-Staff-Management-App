/**
 * File: MessageIndicator.ts
 * Purpose: define shape of data for indicating to mobile user
 * if shift request was accepted/rejected
 */
export default interface MessageIndicator {
    isError: boolean;
    message: string;
}
  