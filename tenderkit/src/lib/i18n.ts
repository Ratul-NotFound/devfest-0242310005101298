// src/lib/i18n.ts
// All UI text strings in English and Bangla (বাংলা) for complete bilingual integration

import { Language } from '@/types';

type TranslationKey =
  | 'app_title'
  | 'app_subtitle'
  | 'load_requirements'
  | 'load_requirements_desc'
  | 'drop_json_here'
  | 'browse_file'
  | 'load_sample_json'
  | 'tender_id'
  | 'tender_title'
  | 'procuring_entity'
  | 'bidder'
  | 'submission_deadline'
  | 'requirements'
  | 'match_req_desc'
  | 'upload_files'
  | 'upload_files_desc'
  | 'drop_pdfs_here'
  | 'browse_pdfs'
  | 'load_sample_pdfs'
  | 'uploaded_files'
  | 'no_files_uploaded'
  | 'pages'
  | 'remove'
  | 'clear'
  | 'duplicate'
  | 'match_documents'
  | 'select_file'
  | 'no_file'
  | 'no_files_yet'
  | 'all_files_matched'
  | 'expiry_date'
  | 'expiry_date_placeholder'
  | 'status'
  | 'status_missing'
  | 'status_expiry_needed'
  | 'status_expired'
  | 'status_not_provided'
  | 'status_ok'
  | 'mandatory'
  | 'optional'
  | 'generate_package'
  | 'generating'
  | 'download_package'
  | 'blocking_issues'
  | 'no_requirements_loaded'
  | 'load_json_first'
  | 'error_not_pdf'
  | 'error_too_large'
  | 'error_too_many'
  | 'error_duplicate_match'
  | 'error_encrypted'
  | 'error_corrupted'
  | 'error_invalid_json'
  | 'error_invalid_format'
  | 'confirm_remove_file'
  | 'language_toggle'
  | 'theme_toggle'
  | 'made_on'
  | 'included_documents'
  | 'cover_page'
  | 'package_ready'
  | 'missing_mandatory'
  | 'needs_expiry_date'
  | 'document_expired'
  | 'unmatch'
  | 'change'
  | 'loading'
  | 'auto_match'
  | 'auto_match_done'
  | 'export_csv'
  | 'save_project'
  | 'load_project'
  | 'total_size'
  | 'of'
  | 'page'
  | 'document'
  | 'match_deadline'
  | 'plus_one_year'
  | 'valid_on_deadline'
  | 'expired_before_deadline'
  | 'local_db_cache'
  | 'clean_delete_db'
  | 'restore_db'
  | 'saved_to_db'
  | 'step_json'
  | 'step_pdfs'
  | 'step_match'
  | 'step_package';

type Translations = Record<TranslationKey, string>;

const en: Translations = {
  app_title: 'TenderKit',
  app_subtitle: 'Tender Document Package Builder',
  load_requirements: 'Load Requirements',
  load_requirements_desc: 'Upload your requirements.json file to begin',
  drop_json_here: 'Drop requirements.json here',
  browse_file: 'Browse File',
  load_sample_json: '⚡ Load Sample JSON',
  tender_id: 'Tender ID',
  tender_title: 'Title',
  procuring_entity: 'Procuring Entity',
  bidder: 'Bidder',
  submission_deadline: 'Submission Deadline',
  requirements: 'Requirements',
  match_req_desc: 'Match PDF files to each required document',
  upload_files: 'Upload PDF Files',
  upload_files_desc: 'Upload all required PDF documents (max 30 files, 50 MB total)',
  drop_pdfs_here: 'Drop PDF files here or click to browse',
  browse_pdfs: 'Browse Files',
  load_sample_pdfs: '⚡ Load Sample PDFs',
  uploaded_files: 'Uploaded Files',
  no_files_uploaded: 'No files uploaded yet',
  pages: 'pages',
  remove: 'Remove',
  clear: 'Clear',
  duplicate: 'Duplicate',
  match_documents: 'Match Documents',
  select_file: 'Select a file...',
  no_file: '-- Select PDF document --',
  no_files_yet: 'No files uploaded yet (upload PDFs above)',
  all_files_matched: 'All uploaded files matched elsewhere',
  expiry_date: 'Document Expiry Date',
  expiry_date_placeholder: 'YYYY-MM-DD',
  status: 'Status',
  status_missing: 'Missing',
  status_expiry_needed: 'Expiry Date Needed',
  status_expired: 'Expired',
  status_not_provided: 'Not Provided',
  status_ok: 'OK',
  mandatory: 'Mandatory',
  optional: 'Optional',
  generate_package: 'Generate Package',
  generating: 'Generating...',
  download_package: 'Download Package',
  blocking_issues: 'Blocking Issues',
  no_requirements_loaded: 'No requirements loaded',
  load_json_first: 'Load a requirements.json file to get started',
  error_not_pdf: 'Only PDF files are accepted. Please remove non-PDF files.',
  error_too_large: 'Total file size exceeds 50 MB limit.',
  error_too_many: 'Maximum 30 files allowed.',
  error_duplicate_match: 'This file is a duplicate and cannot be matched to a different document.',
  error_encrypted: 'This PDF is password-protected and cannot be read.',
  error_corrupted: 'This PDF appears to be damaged and cannot be read.',
  error_invalid_json: 'Invalid JSON file. Please upload a valid requirements.json.',
  error_invalid_format: 'Invalid requirements format. Please check your requirements.json.',
  confirm_remove_file: 'Remove this file?',
  language_toggle: 'বাংলা',
  theme_toggle: 'Toggle Theme',
  made_on: 'Package Generated On',
  included_documents: 'Included Documents',
  cover_page: 'Cover Page',
  package_ready: 'Package is ready to generate',
  missing_mandatory: 'Missing mandatory document',
  needs_expiry_date: 'Expiry date required',
  document_expired: 'Document has expired',
  unmatch: 'Unmatch',
  change: 'Change',
  loading: 'Loading...',
  auto_match: 'Auto-Match',
  auto_match_done: 'Auto-match complete',
  export_csv: 'Export CSV',
  save_project: 'Save to DB',
  load_project: 'Load Project',
  total_size: 'Total size',
  of: 'of',
  page: 'Page',
  document: 'Document',
  match_deadline: 'Match Deadline',
  plus_one_year: '+1 Year',
  valid_on_deadline: 'Valid on deadline',
  expired_before_deadline: 'Expired before deadline',
  local_db_cache: 'Local DB Cache',
  clean_delete_db: 'Clean & Delete Local DB',
  restore_db: 'Restore DB',
  saved_to_db: 'Saved to DB!',
  step_json: '1. JSON',
  step_pdfs: '2. PDFs',
  step_match: '3. Match',
  step_package: '4. Package',
};

const bn: Translations = {
  app_title: 'টেন্ডারকিট',
  app_subtitle: 'টেন্ডার ডকুমেন্ট প্যাকেজ নির্মাতা',
  load_requirements: 'প্রয়োজনীয়তা লোড করুন',
  load_requirements_desc: 'শুরু করতে requirements.json ফাইল আপলোড করুন',
  drop_json_here: 'এখানে requirements.json ড্রপ করুন',
  browse_file: 'ফাইল খুঁজুন',
  load_sample_json: '⚡ নমুনা JSON লোড',
  tender_id: 'টেন্ডার আইডি',
  tender_title: 'শিরোনাম',
  procuring_entity: 'ক্রয়কারী সংস্থা',
  bidder: 'দরদাতা',
  submission_deadline: 'দাখিলের শেষ তারিখ',
  requirements: 'প্রয়োজনীয় কাগজপত্র',
  match_req_desc: 'প্রতিটি প্রয়োজনীয় ডকুমেন্টে পিডিএফ ফাইল মিলান',
  upload_files: 'পিডিএফ ফাইল আপলোড',
  upload_files_desc: 'সব প্রয়োজনীয় পিডিএফ ডকুমেন্ট আপলোড করুন (সর্বোচ্চ ৩০টি ফাইল, মোট ৫০ এমবি)',
  drop_pdfs_here: 'এখানে পিডিএফ ফাইল ড্রপ করুন বা ব্রাউজ করুন',
  browse_pdfs: 'ফাইল খুঁজুন',
  load_sample_pdfs: '⚡ নমুনা PDFs লোড',
  uploaded_files: 'আপলোড করা ফাইলসমূহ',
  no_files_uploaded: 'এখনো কোনো ফাইল আপলোড করা হয়নি',
  pages: 'পৃষ্ঠা',
  remove: 'মুছুন',
  clear: 'মুছুন',
  duplicate: 'ডুপ্লিকেট',
  match_documents: 'ডকুমেন্ট মিলান',
  select_file: 'ফাইল নির্বাচন করুন...',
  no_file: '-- PDF ফাইল নির্বাচন করুন --',
  no_files_yet: 'কোনো PDF ফাইল নেই (উপরে আপলোড করুন)',
  all_files_matched: 'সব ফাইল অন্য ডকুমেন্টে মেলানো হয়েছে',
  expiry_date: 'মেয়াদ শেষের তারিখ',
  expiry_date_placeholder: 'YYYY-MM-DD',
  status: 'অবস্থা',
  status_missing: 'অনুপস্থিত',
  status_expiry_needed: 'মেয়াদ তারিখ প্রয়োজন',
  status_expired: 'মেয়াদ উত্তীর্ণ',
  status_not_provided: 'প্রদান করা হয়নি',
  status_ok: 'ঠিক আছে',
  mandatory: 'বাধ্যতামূলক',
  optional: 'ঐচ্ছিক',
  generate_package: 'প্যাকেজ তৈরি করুন',
  generating: 'তৈরি হচ্ছে...',
  download_package: 'প্যাকেজ ডাউনলোড করুন',
  blocking_issues: 'বাধাদানকারী সমস্যা',
  no_requirements_loaded: 'কোনো প্রয়োজনীয়তা লোড হয়নি',
  load_json_first: 'শুরু করতে requirements.json ফাইল লোড করুন',
  error_not_pdf: 'শুধুমাত্র পিডিএফ ফাইল গ্রহণযোগ্য। অ-পিডিএফ ফাইল সরিয়ে দিন।',
  error_too_large: 'মোট ফাইলের আকার ৫০ এমবি সীমা অতিক্রম করেছে।',
  error_too_many: 'সর্বোচ্চ ৩০টি ফাইল অনুমোদিত।',
  error_duplicate_match: 'এই ফাইলটি একটি ডুপ্লিকেট এবং ভিন্ন ডকুমেন্টের সাথে মেলানো যাবে না।',
  error_encrypted: 'এই পিডিএফটি পাসওয়ার্ড-সুরক্ষিত এবং পড়া যাচ্ছে না।',
  error_corrupted: 'এই পিডিএফটি ক্ষতিগ্রস্ত বলে মনে হচ্ছে এবং পড়া যাচ্ছে না।',
  error_invalid_json: 'অবৈধ JSON ফাইল। একটি বৈধ requirements.json আপলোড করুন।',
  error_invalid_format: 'অবৈধ প্রয়োজনীয়তার ফরম্যাট। আপনার requirements.json যাচাই করুন।',
  confirm_remove_file: 'এই ফাইলটি সরিয়ে দেবেন?',
  language_toggle: 'English',
  theme_toggle: 'থিম পরিবর্তন',
  made_on: 'প্যাকেজ তৈরির তারিখ',
  included_documents: 'অন্তর্ভুক্ত ডকুমেন্টসমূহ',
  cover_page: 'কভার পেজ',
  package_ready: 'প্যাকেজ তৈরির জন্য প্রস্তুত',
  missing_mandatory: 'বাধ্যতামূলক ডকুমেন্ট অনুপস্থিত',
  needs_expiry_date: 'মেয়াদ তারিখ প্রয়োজন',
  document_expired: 'ডকুমেন্টের মেয়াদ শেষ হয়ে গেছে',
  unmatch: 'আনমিলান',
  change: 'পরিবর্তন',
  loading: 'লোড হচ্ছে...',
  auto_match: 'স্বয়ংক্রিয় মিলান',
  auto_match_done: 'স্বয়ংক্রিয় মিলান সম্পন্ন',
  export_csv: 'CSV রপ্তানি',
  save_project: 'DB-তে সংরক্ষণ',
  load_project: 'প্রজেক্ট লোড করুন',
  total_size: 'মোট আকার',
  of: 'এর মধ্যে',
  page: 'পৃষ্ঠা',
  document: 'ডকুমেন্ট',
  match_deadline: 'শেষ তারিখ মিলান',
  plus_one_year: '+১ বছর',
  valid_on_deadline: 'দাখিলের তারিখে কার্যকর',
  expired_before_deadline: 'শেষ তারিখের পূর্বে মেয়াদ উত্তীর্ণ',
  local_db_cache: 'লোকাল DB ক্যাশ',
  clean_delete_db: 'লোকাল DB পরিষ্কার ও মুছুন',
  restore_db: 'পুনরুদ্ধার',
  saved_to_db: 'DB-তে সংরক্ষিত!',
  step_json: '১. JSON',
  step_pdfs: '২. PDFs',
  step_match: '৩. মিলান',
  step_package: '৪. প্যাকেজ',
};

const translations: Record<Language, Translations> = { en, bn };

export function getTranslation(lang: Language): (key: TranslationKey) => string {
  return (key: TranslationKey) => translations[lang][key] ?? key;
}

export type { TranslationKey };
