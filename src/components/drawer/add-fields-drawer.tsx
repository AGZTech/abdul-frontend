// 'use client';

// import React, { useEffect } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// import { Button } from '@/components/ui/button';
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle
// } from '@/components/ui/sheet';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Checkbox } from '@/components/ui/checkbox';
// import { ScrollArea } from '@/components/ui/scroll-area';

// export type FormFieldConfig = {
//   name: string;
//   label: string;
//   type:
//   | 'text'
//   | 'textarea'
//   | 'dropdown'
//   | 'radio'
//   | 'checkbox'
//   | 'email'
//   | 'password'
//   | 'number'
//   | 'file';
//   placeholder?: string;
//   description?: string;
//   options?: { label: string; value: string | number }[];
//   dependency?: {
//     fieldName: string;
//     showWhen: (value: any) => boolean;
//   };
//   onValueChange?: (value: any) => void;
//   accept?: string;
// };

// interface ReusableFormSheetProps<T extends z.ZodObject<any>> {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   description?: string;
//   fields: FormFieldConfig[];
//   schema: T;
//   onSubmit: (data: z.infer<T>) => Promise<void>;
//   initialValues?: Partial<z.infer<T>>;
//   isSubmitting?: boolean;
// }

// const STABLE_EMPTY_OBJECT = {};

// export function ReusableFormSheet<T extends z.ZodObject<any>>({
//   isOpen,
//   onClose,
//   title,
//   description,
//   fields,
//   schema,
//   onSubmit,
//   initialValues = STABLE_EMPTY_OBJECT,
//   isSubmitting = false
// }: ReusableFormSheetProps<T>) {
//   const { control, handleSubmit, reset, watch } = useForm<z.infer<T>>({
//     resolver: zodResolver(schema),
//     defaultValues: initialValues
//   } as any);

//   useEffect(() => {
//     if (isOpen) {
//       reset(initialValues as any);
//     }
//   }, [isOpen, initialValues, reset]);

//   const renderField = (fieldConfig: FormFieldConfig, field: any) => {
//     switch (fieldConfig.type) {
//       case 'textarea':
//         return <Textarea placeholder={fieldConfig.placeholder} {...field} />;
//       case 'dropdown':
//         return (
//           <Select
//             onValueChange={(val) => field.onChange(Number(val))}
//             value={field.value ? String(field.value) : undefined}
//           >
//             <SelectTrigger className='w-full'>
//               <SelectValue placeholder={fieldConfig.placeholder} />
//             </SelectTrigger>
//             <SelectContent>
//               {fieldConfig.options?.map((option) => (
//                 <SelectItem key={option.value} value={String(option.value)}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         );
//       case 'radio':
//         return (
//           <RadioGroup
//             onValueChange={field.onChange}
//             defaultValue={field.value}
//             className='flex items-center space-x-4'
//           >
//             {fieldConfig.options?.map((option) => (
//               <div key={option.value} className='flex items-center space-x-2'>
//                 <RadioGroupItem
//                   value={String(option.value)}
//                   id={`${field.name}-${option.value}`}
//                 />
//                 <Label htmlFor={`${field.name}-${option.value}`}>
//                   {option.label}
//                 </Label>
//               </div>
//             ))}
//           </RadioGroup>
//         );
//       case 'checkbox':
//         return (
//           <div className='flex items-center space-x-2 pt-2'>
//             <Checkbox
//               id={fieldConfig.name}
//               checked={field.value}
//               onCheckedChange={field.onChange}
//             />
//             <Label htmlFor={fieldConfig.name} className='font-normal'>
//               {fieldConfig.description || fieldConfig.label}
//             </Label>
//           </div>
//         );
//       default:
//         return (
//           <Input
//             type={fieldConfig.type}
//             placeholder={fieldConfig.placeholder}
//             {...field}
//           />
//         );
//     }
//   };

//   const watchedFields = watch();

//   return (
//     <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <SheetContent className='sm:max-w-xl'>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <SheetHeader>
//             <SheetTitle>{title}</SheetTitle>
//             {description && <SheetDescription>{description}</SheetDescription>}
//           </SheetHeader>

//           <ScrollArea>
//             <div className='space-y-6 p-4 py-6'>
//               {fields.map((fieldConfig) => {
//                 if (
//                   fieldConfig.dependency &&
//                   !fieldConfig.dependency.showWhen(
//                     watchedFields[fieldConfig.dependency.fieldName]
//                   )
//                 ) {
//                   return null;
//                 }

//                 return (
//                   <Controller
//                     key={fieldConfig.name}
//                     name={fieldConfig.name as any}
//                     control={control}
//                     render={({ field, fieldState: { error } }) => (
//                       <div className='grid w-full items-center gap-1.5'>
//                         {fieldConfig.type !== 'checkbox' && (
//                           <Label htmlFor={field.name}>
//                             {fieldConfig.label}
//                           </Label>
//                         )}
//                         {renderField(fieldConfig, field)}
//                         {fieldConfig.type !== 'checkbox' &&
//                           fieldConfig.description && (
//                             <p className='text-muted-foreground text-sm'>
//                               {fieldConfig.description}
//                             </p>
//                           )}
//                         {error && (
//                           <p className='text-destructive text-sm font-medium'>
//                             {error.message}
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   />
//                 );
//               })}
//             </div>
//           </ScrollArea>

//           <SheetFooter>
//             <Button variant='outline' type='button' onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type='submit' disabled={isSubmitting}>
//               {isSubmitting ? 'Saving...' : 'Save changes'}
//             </Button>
//           </SheetFooter>
//         </form>
//       </SheetContent>
//     </Sheet>
//   );
// }

'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileUpload } from '../custom-ui/file-upload';
import PageContainer from '../layout/page-container';
import { MultiSelect } from '@/components/ui/multi-select';

export type FormFieldConfig = {
  name: string;
  label: string;
  type:
    | 'text'
    | 'textarea'
    | 'dropdown'
    | 'radio'
    | 'checkbox'
    | 'email'
    | 'password'
    | 'number'
    | 'multiselect'
    | 'date'
    | 'file';
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string | number }[];
  dependency?: {
    fieldName: string;
    showWhen: (value: any) => boolean;
  };
  onValueChange?: (
    value: any,
    formSetValue: (name: any, value: any) => void
  ) => void;
  accept?: string;
  fileSize?: number;
  disabled?: boolean | ((watchedFields: Record<string, any>) => boolean);
};

interface ReusableFormSheetProps<T extends z.ZodObject<any>> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void>;
  initialValues?: Partial<z.infer<T>>;
  isSubmitting?: boolean;
}

const STABLE_EMPTY_OBJECT = {};

export function ReusableFormSheet<T extends z.ZodObject<any>>({
  isOpen,
  onClose,
  title,
  description,
  fields,
  schema,
  onSubmit,
  initialValues = STABLE_EMPTY_OBJECT,
  isSubmitting = false
}: ReusableFormSheetProps<T>) {
  const { control, handleSubmit, reset, watch, setValue } = useForm<z.infer<T>>(
    {
      resolver: zodResolver(schema),
      defaultValues: initialValues
    } as any
  );

  useEffect(() => {
    if (isOpen) {
      reset(initialValues as any);
    }
  }, [isOpen, initialValues, reset]);

  const renderField = (fieldConfig: FormFieldConfig, field: any) => {
    switch (fieldConfig.type) {
      case 'textarea':
        return <Textarea placeholder={fieldConfig.placeholder} {...field} />;
      case 'dropdown': {
        const isDisabled =
          typeof fieldConfig.disabled === 'function'
            ? fieldConfig.disabled(watchedFields)
            : fieldConfig.disabled;

        return (
          <Select
            onValueChange={(val) => {
              const numericValue = Number(val);
              field.onChange(numericValue);
              if (fieldConfig.onValueChange) {
                fieldConfig.onValueChange(numericValue, setValue);
              }
            }}
            value={field.value ? String(field.value) : undefined}
            disabled={isDisabled}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={fieldConfig.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {fieldConfig.options?.map((option) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      case 'radio':
        return (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className='flex items-center space-x-4'
          >
            {fieldConfig.options?.map((option) => (
              <div
                key={String(option.value)}
                className='flex items-center space-x-2'
              >
                <RadioGroupItem
                  value={String(option.value)}
                  id={`${field.name}-${option.value}`}
                />
                <Label htmlFor={`${field.name}-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'checkbox':
        return (
          <div className='flex items-center space-x-2 pt-2'>
            <Checkbox
              id={fieldConfig.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor={fieldConfig.name} className='font-normal'>
              {fieldConfig.description || fieldConfig.label}
            </Label>
          </div>
        );
      case 'file': {
        const isDisabled =
          typeof fieldConfig.disabled === 'function'
            ? fieldConfig.disabled(watchedFields)
            : fieldConfig.disabled;
        return (
          <FileUpload
            accept={fieldConfig.accept}
            maxSize={fieldConfig.fileSize || 5 * 1024 * 1024}
            maxFiles={1}
            onChange={(files) => field.onChange(files)}
            multiple={true}
            disabled={isDisabled}
          />
        );
      }
      // Add this import at the top

      // Then add this case to your renderField function, before the 'default' case:
      case 'multiselect': {
        const isDisabled =
          typeof fieldConfig.disabled === 'function'
            ? fieldConfig.disabled(watchedFields)
            : fieldConfig.disabled;

        // Convert options to the format MultiSelect expects
        const multiSelectOptions =
          fieldConfig.options?.map((option) => ({
            value: String(option.value),
            label: option.label
          })) || [];

        // Convert current value to string array (MultiSelect expects string[])
        const currentValue = Array.isArray(field.value)
          ? field.value.map(String)
          : field.value
            ? [String(field.value)]
            : [];

        return (
          <MultiSelect
            options={multiSelectOptions}
            selected={currentValue}
            onSelectedChange={(selectedValues) => {
              if (isDisabled) return;
              // Convert string values back to original type (number or string)
              const processedValues = selectedValues.map((val) => {
                // If original options were numbers, convert back to numbers
                const originalOption = fieldConfig.options?.find(
                  (opt) => String(opt.value) === val
                );
                return originalOption ? originalOption.value : val;
              });

              field.onChange(processedValues);
              if (fieldConfig.onValueChange) {
                fieldConfig.onValueChange(processedValues, setValue);
              }
            }}
            placeholder={fieldConfig.placeholder || 'Select options...'}
          />
        );
      }

      default:
        const isDisabled =
          typeof fieldConfig.disabled === 'function'
            ? fieldConfig.disabled(watchedFields)
            : fieldConfig.disabled;
        return (
          <Input
            type={fieldConfig.type}
            placeholder={fieldConfig.placeholder}
            {...field}
            disabled={isDisabled}
          />
        );
    }
  };

  const watchedFields = watch();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className='flex h-screen flex-col sm:max-w-4xl'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex h-full flex-col'
        >
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>

          <ScrollArea className='flex-1 overflow-hidden'>
            <div className='grid grid-cols-2 gap-3 space-y-2 p-4 py-6'>
              {fields.map((fieldConfig) => {
                if (
                  fieldConfig.dependency &&
                  !fieldConfig.dependency.showWhen(
                    watchedFields[fieldConfig.dependency.fieldName]
                  )
                ) {
                  return null;
                }

                return (
                  <Controller
                    key={fieldConfig.name}
                    name={fieldConfig.name as any}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <div className='grid w-full items-center gap-1.5'>
                        {fieldConfig.type !== 'checkbox' && (
                          <Label htmlFor={field.name}>
                            {fieldConfig.label}
                          </Label>
                        )}
                        {renderField(fieldConfig, field)}
                        {fieldConfig.type !== 'checkbox' &&
                          fieldConfig.description && (
                            <p className='text-muted-foreground text-sm'>
                              {fieldConfig.description}
                            </p>
                          )}
                        {error && (
                          <p className='text-destructive text-sm font-medium'>
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                );
              })}
            </div>
          </ScrollArea>

          <SheetFooter>
            <Button variant='outline' type='button' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
