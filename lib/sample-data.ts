import { Book, SiteSettings } from './types';
import localBooksData from './local-books.json';

export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'Pages by Nana',
  tagline: 'Techno-thrillers and speculative fiction, quietly told.',
  author_name: 'Nana Kwame Dickson',
  author_bio: 'Nana Kwame Dickson writes techno-thrillers and speculative fiction exploring cybersecurity, AI, and identity in Accra and beyond.',
  paystack_url: 'https://paystack.com/pay/pagesbynana',
  kofi_url: 'https://ko-fi.com/pagesbynana',
  admin_email: 'nanakwamedickson@outlook.com',
};

export const SAMPLE_BOOKS: Book[] = localBooksData as Book[];
