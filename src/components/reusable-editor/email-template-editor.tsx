'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import FontFamily from '@tiptap/extension-font-family';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Strike from '@tiptap/extension-strike';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Eye, Code, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import TiptapToolbar from '@/components/email-template/tiptap-toolbar';
import PageContainer from '@/components/layout/page-container';
import { WizardTabs } from '@/components/wizard/WizardTabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  CustomTableCell,
  CustomTableHeader,
  CustomTableRow,
  DivExtension,
  EmailImageExtension,
  EmailTable,
  GlobalStyleExtension
} from '@/utils/emailTemplate';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { PostCall, GetCall } from '@/lib/apiClient';
import { LoadingButton } from '../ui/custom/loading-button';
import GenerateButton from '../ui/custom/generate-button';
import { Separator } from '../ui/separator';

interface ResuableTemplateEditorProps {
  companyId?: string;
  campaignId?: string;
  subjectId?: string;
  onTemplateIdChange: (id: number) => void;
}

// Mock timezone data
const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' }
];

export default function ResuableTemplateEditor({
  companyId,
  campaignId,
  subjectId,
  onTemplateIdChange
}: ResuableTemplateEditorProps) {
  const [templateContent, setTemplateContent] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [activeTab, setActiveTab] = useState('visual');
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('');
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [templateName, setTemplateName] = useState(''); // New state for editable template name
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const isEditorUpdate = useRef(false);
  const [activeStep, setActiveStep] = useState(1);
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [testTemplateData, setTestTemplateData] = useState<any>(null);
  const [isLoadingTest, setIsLoadingTest] = useState(false);
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const [sending, setSending] = useState(false);

  const editor = useEditor({
    extensions: [
      GlobalStyleExtension,
      DivExtension,
      StarterKit.configure({
        horizontalRule: false,
        paragraph: {
          HTMLAttributes: {
            style: null,
            align: null
          }
        }
      }),
      Underline,
      Subscript,
      Superscript,
      Strike,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'div'],
        alignments: ['left', 'center', 'right', 'justify']
      }),

      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          style: null,
          target: null,
          rel: null
        }
      }),
      EmailImageExtension,
      EmailTable,
      CustomTableRow,
      CustomTableHeader,
      CustomTableCell,
      Placeholder.configure({
        placeholder:
          'Build your email with layout snippets or by inserting tables...'
      }),
      HorizontalRule
    ],
    content: templateContent,
    onUpdate: ({ editor }) => {
      isEditorUpdate.current = true;
      const html = editor.getHTML();
      setTemplateContent(html);
      if (activeTab === 'visual') {
        setHtmlContent(html);
      }
    },
    editorProps: {
      transformPastedHTML(html) {
        return html.replace(/<table([^>]*)>/gi, (match, attrs) => {
          const hasAlign = /align=["'][^"']*["']/i.test(attrs);
          return `<table${hasAlign ? attrs : `${attrs} align="center"`} style="margin: 0 auto; width: 100%;">`;
        });
      }
    },
    immediatelyRender: false,
    parseOptions: {
      preserveWhitespace: 'full'
    }
  });

  const previewEditor = useEditor({
    extensions: [
      GlobalStyleExtension,
      DivExtension,
      StarterKit.configure({
        horizontalRule: false,
        paragraph: {
          HTMLAttributes: {
            style: null,
            align: null
          }
        }
      }),
      Underline,
      Subscript,
      Superscript,
      Strike,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'div'],
        alignments: ['left', 'center', 'right', 'justify']
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          style: null,
          target: null,
          rel: null
        }
      }),
      EmailImageExtension,
      EmailTable,
      CustomTableRow,
      CustomTableHeader,
      CustomTableCell,
      HorizontalRule
    ],
    content: '',
    editable: false, // Make it read-only for preview
    immediatelyRender: false,
    parseOptions: {
      preserveWhitespace: 'full'
    }
  });

  // Fetch subject name if subjectId is provided
  const fetchSubjectName = React.useCallback(async () => {
    if (!subjectId) return;

    try {
      const response = await GetCall(`/api/company/subject/${subjectId}`);
      if (response.code === 'SUCCESS' && response.data) {
        const fetchedSubjectName = response.data.subjectName || '';
        setSubjectName(fetchedSubjectName);
        setTemplateName(fetchedSubjectName); // Prefill template name with subject name
      } else {
        console.warn('Failed to fetch subject name, using default');
        setSubjectName('Default Template');
        setTemplateName('Default Template');
      }
    } catch (err: any) {
      console.error('Error fetching subject name:', err);
      setSubjectName('Default Template');
      setTemplateName('Default Template');
    }
  }, [subjectId]);

  // Fetch email templates
  const fetchEmailTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const response = await GetCall('/api/company/email-template/get');
      if (response.code === 'SUCCESS') {
        setEmailTemplates(response.data || []);
      } else {
        toast.error('Failed to fetch email templates.');
      }
    } catch (err: any) {
      console.error('Error fetching email templates:', err);
      toast.error(
        err.message || 'An error occurred while fetching email templates.'
      );
    } finally {
      setLoadingTemplates(false);
    }
  };

  // Create email template
  const handleCreateEmailTemplate = async () => {
    if (!templateContent.trim()) {
      toast.error('Please create some template content first.');
      return;
    }

    if (!templateName.trim()) {
      toast.error('Please enter a template name.');
      return;
    }

    const payload = {
      templateName: templateName,
      emailSubject: templateName, // Using the same template name for email subject
      templateData: templateContent,
      campaignId: campaignId ? parseInt(campaignId) : 0,
      companyId: companyId ? parseInt(companyId) : 0,
      subjectId: subjectId ? parseInt(subjectId) : 0
    };

    setIsCreatingTemplate(true);
    try {
      const response = await PostCall(
        '/api/company/email-template/create',
        payload
      );

      if (response.code === 'SUCCESS') {
        toast.success('Email template created successfully!');
        // Refresh the templates list
        await fetchEmailTemplates();
      } else {
        toast.error(response.message || 'Failed to create email template.');
      }
    } catch (err: any) {
      console.error('Error creating email template:', err);
      toast.error(
        err.message || 'An error occurred while creating the email template.'
      );
    } finally {
      setIsCreatingTemplate(false);
    }
  };

  useEffect(() => {
    if (selectedEmailTemplate) {
      onTemplateIdChange(parseInt(selectedEmailTemplate));
    }
  }, [selectedEmailTemplate, onTemplateIdChange]);

  useEffect(() => {
    fetchEmailTemplates();
    if (subjectId) {
      fetchSubjectName();
    }
  }, [subjectId, fetchSubjectName]);

  useEffect(() => {
    if (
      editor &&
      !isEditorUpdate.current &&
      editor.getHTML() !== templateContent
    ) {
      editor.commands.setContent(templateContent);
      setHtmlContent(templateContent);
    }
    isEditorUpdate.current = false;
  }, [templateContent, editor]);

  const handleTabChange = (value: string) => {
    if (value === 'html' && editor) {
      setHtmlContent(editor.getHTML());
    } else if (value === 'visual' && editor) {
      editor.commands.setContent(htmlContent);
    }
    setActiveTab(value);
  };

  const handleNext = () => {
    const currentContent =
      activeTab === 'visual' ? templateContent : htmlContent;

    const payload = {
      templateData: currentContent,
      scheduleDate: scheduleDate ? format(scheduleDate, 'yyyy-MM-dd') : null,
      country: selectedCountry,
      timezone: selectedTimezone
    };

    console.log(payload);

    // onNext(payload);
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!prompt.trim()) {
        toast.error('Please enter a prompt before generating.');
        setIsSubmitting(false);
        return;
      }

      const payload = { userPrompt: prompt };

      const response = await PostCall(
        '/api/company/email-template/ai-model-create',
        payload
      );

      if (response.code === 'SUCCESS') {
        toast.success('Email template generated successfully!');
        // Optionally set HTML content from backend
        if (response.data?.html) {
          const generatedHTML = response.data.html;

          setHtmlContent(generatedHTML); // updates HTML textarea
          setTemplateContent(generatedHTML); // keeps visual & HTML tab synced
          editor?.commands.setContent(generatedHTML); // updates visual TipTap editor
        }
      } else {
        toast.error(response.message || 'Failed to generate template.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmail = async () => {
    if (emails.length === 0) {
      toast.error('Please add at least one email address.');
      return;
    }

    if (!selectedEmailTemplate) {
      toast.error('No email template selected.');
      return;
    }

    if (!testTemplateData) {
      toast.error('No template data loaded.');
      return;
    }
    setSending(true);
    const payload = {
      emailIds: emails,
      testSubject: testTemplateData.emailSubject || 'Test Email',
      emailTemplateId: parseInt(selectedEmailTemplate)
    };

    try {
      const response = await PostCall('/api/company/test-email', payload);

      if (response.code === 'SUCCESS') {
        toast.success('Test email sent successfully!');
        handleCloseDialog();
        // Clear the emails after successful send
        setEmails([]);
        setInputValue('');
      } else {
        toast.error(response.message || 'Failed to send test email.');
      }
    } catch (err: any) {
      console.error('Error sending test email:', err);
      toast.error(err.message || 'An error occurred while sending test email.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newEmail = inputValue.trim();
      if (newEmail && !emails.includes(newEmail)) {
        setEmails([...emails, newEmail]);
        setInputValue('');
      }
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleTestEmailTemplate = async () => {
    if (!selectedEmailTemplate) {
      toast.error('Please select an email template first.');
      return;
    }

    setIsLoadingTest(true);
    try {
      const response = await GetCall(`/api/company/${selectedEmailTemplate}`);

      if (response.code === 'SUCCESS') {
        setTestTemplateData(response.data);
        if (previewEditor && response.data.templateData) {
          previewEditor.commands.setContent(response.data.templateData);
        }
        handleOpenDialog(); // Open the preview dialog
        toast.success('Email template loaded successfully!');
      } else {
        toast.error(response.message || 'Failed to load email template.');
      }
    } catch (err: any) {
      console.error('Error testing email template:', err);
      toast.error(
        err.message || 'An error occurred while loading the email template.'
      );
    } finally {
      setIsLoadingTest(false);
    }
  };
  return (
    <>
      {/* Email Template Editor */}
      <div className='space-y-2'>
        <Label className='text-lg font-semibold'>Create Email Template</Label>
        <div className='overflow-hidden rounded-lg border'>
          <div className='flex w-full justify-center'>
            <Tabs defaultValue='create' className='w-full'>
              {/* Tabs Header */}
              <TabsList className='mb-4 grid w-full grid-cols-2 bg-gray-100'>
                <TabsTrigger value='create' className='text-sm font-medium'>
                  Create Template
                </TabsTrigger>
                <TabsTrigger value='select' className='text-sm font-medium'>
                  Select Template
                </TabsTrigger>
              </TabsList>

              {/* --- CREATE TEMPLATE TAB --- */}
              <TabsContent value='create'>
                <div className='flex w-full justify-center'>
                  <div className='w-full'>
                    <div className='mb-2 px-2'>
                      <div className='flex flex-col space-y-2'>
                        {/* Template Name Input */}
                        <div className=''>
                          <Label className='text-sm font-medium text-gray-700'>
                            Template Name{' '}
                            <span className='text-sm font-light italic'>
                              *(If you are not triggering new campaign then
                              please change this name)
                            </span>
                          </Label>
                          <Input
                            placeholder='Enter template name'
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className='mt-1 h-11'
                          />
                        </div>

                        {/* Prompt Label */}
                        <div className='mt-1'>
                          <Label className='text-sm font-medium text-gray-700'>
                            Enter the prompt here.
                          </Label>
                        </div>

                        {/* Prompt Input */}
                        <Input
                          placeholder='Enter title or prompt for AI generate template'
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className='h-11'
                        />

                        {/* Buttons Section */}
                        <div className='mt-2 flex flex-wrap items-center justify-end gap-3'>
                          <GenerateButton
                            onClick={handleFormSubmit}
                            isLoading={isSubmitting}
                          ></GenerateButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Tabs
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className='w-full'
                >
                  <TabsList className='w-full justify-start rounded-none border-b bg-gray-50'>
                    <TabsTrigger value='visual' className='gap-2'>
                      <Eye className='h-4 w-4' />
                      Visual Editor
                    </TabsTrigger>
                    <TabsTrigger value='html' className='gap-2'>
                      <Code className='h-4 w-4' />
                      HTML Source
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value='visual' className='m-0'>
                    <TiptapToolbar editor={editor} />
                    <div
                      className='overflow-auto p-4'
                      style={{ minHeight: '400px' }}
                    >
                      <EditorContent
                        editor={editor}
                        className='prose max-w-none'
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value='html' className='m-0 p-0'>
                    <div className='flex items-center gap-2 border-b bg-gray-50 px-4 py-2 text-sm text-gray-600'>
                      <span className='text-blue-600'>ℹ️</span>
                      Edit raw HTML code here. Changes will be reflected in the
                      visual editor.
                    </div>
                    <Textarea
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      className='w-full rounded-none border-0 font-mono text-sm focus-visible:ring-0'
                      style={{
                        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                        minHeight: '450px',
                        resize: 'none'
                      }}
                      placeholder='Enter your HTML content here...'
                    />
                  </TabsContent>
                </Tabs>
                <div className='mx-3 mt-2 mb-3 flex flex-wrap items-center justify-end gap-3'>
                  <Button
                    className='cursor-pointer'
                    onClick={handleCreateEmailTemplate}
                    disabled={isCreatingTemplate}
                  >
                    {isCreatingTemplate ? 'Creating...' : 'Save Email Template'}
                  </Button>
                </div>
              </TabsContent>

              {/* --- SELECT TEMPLATE TAB --- */}
              <TabsContent value='select'>
                <div className='mx-2 mb-2 space-y-2'>
                  <Label htmlFor='email-template'>Email Template</Label>
                  <Select
                    value={selectedEmailTemplate}
                    onValueChange={setSelectedEmailTemplate}
                    disabled={loadingTemplates}
                  >
                    <SelectTrigger id='email-template' className='w-full'>
                      <SelectValue
                        placeholder={
                          loadingTemplates
                            ? 'Loading templates...'
                            : 'Select email template'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template: any) => (
                        <SelectItem
                          key={template.emailTemplateId}
                          value={template.emailTemplateId}
                        >
                          {template.templateName ||
                            `Template ${template.emailTemplateId}`}
                        </SelectItem>
                      ))}
                      {emailTemplates.length === 0 && !loadingTemplates && (
                        <SelectItem value='no-templates' disabled>
                          No templates available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <div className='flex justify-end'>
                    <Button
                      className='cursor-pointer'
                      onClick={handleTestEmailTemplate}
                      disabled={isLoadingTest || !selectedEmailTemplate}
                    >
                      {isLoadingTest ? 'Loading...' : 'Test Email Template'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Schedule Date & Time Section */}
      {/* <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>Mass Email Dispatch</h3>
        </div>
        <Separator /> */}
      {/* Second Phase */}
      {/* <div>
          <div className='space-y-2'>
            <Label htmlFor='email-template'>Email Template</Label>
            <Select
              value={selectedEmailTemplate}
              onValueChange={setSelectedEmailTemplate}
              disabled={loadingTemplates}
            >
              <SelectTrigger id='email-template' className='w-full'>
                <SelectValue
                  placeholder={
                    loadingTemplates
                      ? 'Loading templates...'
                      : 'Select email template'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {emailTemplates.map((template) => (
                  <SelectItem
                    key={template.emailTemplateId}
                    value={template.emailTemplateId}
                  >
                    {template.templateName ||
                      `Template ${template.emailTemplateId}`}
                  </SelectItem>
                ))}
                {emailTemplates.length === 0 && !loadingTemplates && (
                  <SelectItem value='no-templates' disabled>
                    No templates available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div> */}
      {/* <div className='grid grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='schedule-date'>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id='schedule-date'
                  variant='outline'
                  className='w-full justify-start text-left font-normal'
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {scheduleDate ? format(scheduleDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={scheduleDate}
                  onSelect={setScheduleDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='country'>Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger id='country' className='w-full'>
                <SelectValue placeholder='Select country' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='us'>United States</SelectItem>
                <SelectItem value='uk'>United Kingdom</SelectItem>
                <SelectItem value='in'>India</SelectItem>
                <SelectItem value='ca'>Canada</SelectItem>
                <SelectItem value='au'>Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='timezone'>Timezone</Label>
            <Select
              value={selectedTimezone}
              onValueChange={setSelectedTimezone}
            >
              <SelectTrigger id='timezone' className='w-full'>
                <SelectValue placeholder='Select timezone' />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div> */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-h-[95vh] overflow-y-auto rounded-sm p-6 sm:max-w-[800px]'>
          <DialogHeader>
            <DialogTitle className='text-lg font-semibold'>
              Test Email Function
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <Label>Email IDs</Label>
            <div className='flex flex-wrap items-center gap-2 rounded-md border p-2'>
              {emails.map((email) => (
                <div
                  key={email}
                  className='flex items-center rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-700'
                >
                  {email}
                  <button
                    className='ml-2 text-blue-600 hover:text-red-600'
                    onClick={() => removeEmail(email)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <Input
                className='min-w-[120px] flex-1 border-none focus-visible:ring-0'
                placeholder='Type and press Enter or comma'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Email Template Preview */}
            <div className='rounded-lg border bg-gray-50 p-4 shadow-sm'>
              <p className='mb-2 font-medium text-gray-700'>
                Email Template Preview
              </p>

              <div className='rounded-lg border bg-white p-6 text-center'>
                <EditorContent
                  editor={previewEditor}
                  className='prose max-w-none'
                />
              </div>
            </div>

            {/* Send Button */}
            <div className='flex justify-end'>
              <LoadingButton
                onClick={handleSendEmail}
                className='bg-[#1F4FFF] text-white hover:bg-[#1E3ADE]'
                isLoading={sending}
              >
                Send Test Email
              </LoadingButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
