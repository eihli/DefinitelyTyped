declare module "react-jsonschema-form" {
    import * as React from "react";
    import { JSONSchema6 } from "json-schema";

    type ErrorSchema = {
        [k: string]: ErrorSchema;
    };

    export interface FormProps<T> {
        children?: React.ReactNode;
        /** Form schema */
        schema: JSONSchema6;
        /** If true, disabled prop is passed down to each field on the form */
        disabled?: boolean | undefined;
        /** Form uiSchema */
        uiSchema?: UiSchema | undefined;
        /** Data to pass into form mathcing the schema */
        formData?: T | undefined;
        /** Data that is passed down to all fields and widgets. Used for implementing context aware fields and widgets */
        formContext?: any;
        /** Directory of registered widgets */
        widgets?: { [name: string]: Widget } | undefined;
        /** Dictionary of registered fields */
        fields?: { [name: string]: Field } | undefined;
        /**
         * If set to true, turns off all validation
         * @default false
         */
        noValidate?: boolean | undefined;
        /**
         * If set to true, turns off HTML5 validation
         * @default false
         */
        noHtml5Validate?: boolean | undefined;
        /** When true, a list of errors will show. When false, only inline input validation errors will show */
        showErrorList?: boolean | undefined;
        /** A React component used to customize how form errors are displayed */
        ErrorList?: React.FunctionComponent<ErrorListProps> | undefined;
        /** Function that specifices custom validation rules for the form */
        validate?: ((formData: T, errors: FormValidation) => FormValidation) | undefined;
        onBlur?: ((id: string, value: boolean | number | string | null) => void) | undefined;
        onChange?: ((e: IChangeEvent<T>, es?: ErrorSchema) => any) | undefined;
        onError?: ((e: any) => any) | undefined;
        onFocus?: ((id: string, value: boolean | number | string | null) => void) | undefined;
        onSubmit?: ((e: ISubmitEvent<T>) => any) | undefined;
        /**
         * If set to true, will perform validation as data is changed rather than just on submit
         * @default false
         */
        liveValidate?: boolean | undefined;
        FieldTemplate?: React.FunctionComponent<FieldTemplateProps> | undefined;
        ArrayFieldTemplate?: React.FunctionComponent<ArrayFieldTemplateProps> | undefined;
        ObjectFieldTemplate?: React.FunctionComponent<ObjectFieldTemplateProps> | undefined;
        safeRenderCompletion?: boolean | undefined;
        /** Function that modifies default errors from JSCON Schema Validation */
        transformErrors?: ((errors: AjvError[]) => AjvError[]) | undefined;
        /**
         * Used to change prefix of ids to avoid collision with existing ids in DOM
         * @default 'root'
         */
        idPrefix?: string | undefined;
        /** Allows you to validate formdata against another JSON Schema meta schema */
        additionalMetaSchemas?: readonly object[] | undefined;
        /** Allows you to define custom formats for validation */
        customFormats?: { [k: string]: string | RegExp | ((data: string) => boolean) } | undefined;
        // HTML Attributes
        /** The value that will be passed to `id` HTML attribute of form  */
        id?: string | undefined;
        /** The value that will be passed to `class` HTML attribute of form  */
        className?: string | undefined;
        /** The value that will be passed to `name` HTML attribute of form  */
        name?: string | undefined;
        /** The value that will be passed to `method` HTML attribute of form  */
        method?: string | undefined;
        /** The value that will be passed to `target` HTML attribute of form  */
        target?: string | undefined;
        /** The value that will be passed to `action` HTML attribute of form  */
        action?: string | undefined;
        /** @deprecated Same functionality as autoComplete */
        autocomplete?: string | undefined;
        /** The value that will be passed to `autocomplete ` HTML attribute of form */
        autoComplete?: string | undefined;
        /** The value that will be passed to `enctype` HTML attribute of form  */
        enctype?: string | undefined;
        /** The value that will be passed to `accept-charset` HTML attribute of form  */
        acceptcharset?: string | undefined;
        /**
         * If set to true, extra form data values not in form field will be removed when `onSubmit` is called
         * @default false
         */
        omitExtraData?: boolean | undefined;
        /**
         * If `omitExtraData` and `liveOmit` are both set to true, then extra form data values that are not in any form field will be removed whenever `onChange` is called.
         * @default false
         */
        liveOmit?: boolean | undefined;
        /** Used to change the default `form` tag into a different HTML tag */
        tagName?: keyof JSX.IntrinsicElements | React.ComponentType | undefined;
    }

    export default class Form<T> extends React.Component<FormProps<T>> {
        validate: (
            formData: T,
            schema?: FormProps<T>["schema"],
            additionalMetaSchemas?: FormProps<T>["additionalMetaSchemas"],
            customFormats?: FormProps<T>["customFormats"],
        ) => { errors: AjvError[]; errorSchema: ErrorSchema };
        onChange: (formData: T, newErrorSchema: ErrorSchema) => void;
        onBlur: (id: string, value: boolean | number | string | null) => void;
        submit: () => void;
    }

    export type UiSchema = {
        "ui:field"?: Field | string | undefined;
        "ui:widget"?: Widget | string | undefined;
        "ui:options"?: { [key: string]: boolean | number | string | object | any[] | null } | undefined;
        "ui:order"?: string[] | undefined;
        "ui:FieldTemplate"?: React.FunctionComponent<FieldTemplateProps> | undefined;
        "ui:ArrayFieldTemplate"?: React.FunctionComponent<ArrayFieldTemplateProps> | undefined;
        "ui:ObjectFieldTemplate"?: React.FunctionComponent<ObjectFieldTemplateProps> | undefined;
        [name: string]: any;
    };

    export type FieldId = {
        $id: string;
    };

    export type IdSchema<T = any> =
        & {
            [key in keyof T]: IdSchema<T[key]>;
        }
        & FieldId;

    export type FieldPath = {
        $name: string;
    };

    export type PathSchema<T = any> =
        & {
            [key in keyof T]: PathSchema<T[key]>;
        }
        & FieldPath;

    export interface WidgetProps extends
        Pick<
            React.HTMLAttributes<HTMLElement>,
            Exclude<keyof React.HTMLAttributes<HTMLElement>, "onBlur" | "onFocus">
        >
    {
        /** The generated id for this field */
        id: string;
        /** The JSONSchema subschema object for this field */
        schema: JSONSchema6;
        /** The current value for this field; */
        value: any;
        required: boolean;
        disabled: boolean;
        readonly: boolean;
        autofocus: boolean;
        /** The value change event handler; call it with the new value every time it changes */
        onChange: (value: any) => void;
        options: { [key: string]: boolean | number | string | object | null };
        /** The formContext object that you passed to Form. */
        formContext: any;
        /** The input blur event handler; call it with the the widget id and value */
        onBlur: (id: string, value: boolean | number | string | null) => void;
        /** The input blur event handler; call it with the the widget id and value */
        onFocus: (id: string, value: boolean | number | string | null) => void;
        label: string;
        /** An array of strings listing all generated error messages from encountered errors for this widget. */
        rawErrors: string[];
    }

    export type Widget = React.FunctionComponent<WidgetProps> | React.ComponentClass<WidgetProps>;

    export interface FieldProps<T = any>
        extends Pick<React.HTMLAttributes<HTMLElement>, Exclude<keyof React.HTMLAttributes<HTMLElement>, "onBlur">>
    {
        schema: JSONSchema6;
        uiSchema: UiSchema;
        idSchema: IdSchema;
        formData: T;
        errorSchema: ErrorSchema;
        onChange: (e: IChangeEvent<T> | any, es?: ErrorSchema) => any;
        onBlur: (id: string, value: boolean | number | string | null) => void;
        registry: {
            fields: { [name: string]: Field };
            widgets: { [name: string]: Widget };
            definitions: { [name: string]: any };
            formContext: any;
        };
        formContext: any;
        autofocus: boolean;
        disabled: boolean;
        readonly: boolean;
        required: boolean;
        name: string;
        [prop: string]: any;
    }

    export type Field = React.FunctionComponent<FieldProps> | React.ComponentClass<FieldProps>;

    export type FieldTemplateProps = {
        id: string;
        classNames: string;
        label: string;
        description: React.ReactElement;
        rawDescription: string;
        children: React.ReactElement;
        errors: React.ReactElement;
        rawErrors: string[];
        help: React.ReactElement;
        rawHelp: string;
        hidden: boolean;
        required: boolean;
        readonly: boolean;
        disabled: boolean;
        displayLabel: boolean;
        fields: Field[];
        schema: JSONSchema6;
        uiSchema: UiSchema;
        formContext: any;
    };

    export type ArrayFieldTemplateProps<T = any> = {
        DescriptionField: React.FunctionComponent<{ id: string; description: string | React.ReactElement }>;
        TitleField: React.FunctionComponent<{ id: string; title: string; required: boolean }>;
        canAdd: boolean;
        className: string;
        disabled: boolean;
        idSchema: IdSchema;
        items: Array<{
            children: React.ReactElement;
            className: string;
            disabled: boolean;
            hasMoveDown: boolean;
            hasMoveUp: boolean;
            hasRemove: boolean;
            hasToolbar: boolean;
            index: number;
            onDropIndexClick: (index: number) => (event: any) => void;
            onReorderClick: (index: number, newIndex: number) => (event: any) => void;
            readonly: boolean;
            key: string;
        }>;
        onAddClick: (event: any) => (event: any) => void;
        readonly: boolean;
        required: boolean;
        schema: JSONSchema6;
        uiSchema: UiSchema;
        title: string;
        formContext: any;
        formData: T;
        registry: FieldProps["registry"];
    };

    export type ObjectFieldTemplateProps<T = any> = {
        DescriptionField: React.FunctionComponent<{ id: string; description: string | React.ReactElement }>;
        TitleField: React.FunctionComponent<{ id: string; title: string; required: boolean }>;
        title: string;
        description: string;
        properties: Array<{
            content: React.ReactElement;
            name: string;
            disabled: boolean;
            readonly: boolean;
        }>;
        required: boolean;
        schema: JSONSchema6;
        uiSchema: UiSchema;
        idSchema: IdSchema;
        formData: T;
        formContext: any;
    };

    export type AjvError = {
        message: string;
        name: string;
        params: any;
        property: string;
        stack: string;
    };

    export type ErrorListProps = {
        errorSchema: FormValidation;
        errors: AjvError[];
        formContext: any;
        schema: JSONSchema6;
        uiSchema: UiSchema;
    };

    export interface IChangeEvent<T = any> {
        edit: boolean;
        formData: T;
        errors: AjvError[];
        errorSchema: FormValidation;
        idSchema: IdSchema;
        schema: JSONSchema6;
        uiSchema: UiSchema;
        status?: string | undefined;
    }

    export type ISubmitEvent<T> = IChangeEvent<T>;

    export type FieldError = string;

    type FieldValidation = {
        __errors: FieldError[];
        addError: (message: string) => void;
    };

    type FormValidation = FieldValidation & {
        [fieldName: string]: FieldValidation;
    };

    type FormSubmit<T = any> = {
        formData: T;
    };

    export type ThemeProps<T = any> = Omit<FormProps<T>, "schema">;

    export function withTheme<T = any>(
        themeProps: ThemeProps<T>,
    ): React.ComponentClass<FormProps<T>> | React.FunctionComponent<FormProps<T>>;

    export type AddButtonProps = {
        className: string;
        onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
        disabled: boolean;
    };
}

declare module "react-jsonschema-form/lib/components/fields/SchemaField" {
    import { JSONSchema6 } from "json-schema";
    import { FieldProps, FormValidation, IdSchema, UiSchema } from "react-jsonschema-form";

    export type SchemaFieldProps<T = any> = Pick<
        FieldProps<T>,
        "schema" | "uiSchema" | "idSchema" | "formData" | "errorSchema" | "registry" | "formContext"
    >;

    export default class SchemaField extends React.Component<SchemaFieldProps> {}
}

declare module "react-jsonschema-form/lib/utils" {
    import { JSONSchema6, JSONSchema6Definition, JSONSchema6Type, JSONSchema6TypeName } from "json-schema";
    import { FieldProps, IdSchema, PathSchema, UiSchema, Widget } from "react-jsonschema-form";

    export const ADDITIONAL_PROPERTY_FLAG: string;

    export function getDefaultRegistry(): FieldProps["registry"];

    export function getSchemaType(schema: JSONSchema6): string;

    export function getWidget(
        schema: JSONSchema6,
        widget: Widget | string,
        registeredWidgets?: { [name: string]: Widget },
    ): Widget;

    export function hasWidget(
        schema: JSONSchema6,
        widget: Widget | string,
        registeredWidgets?: { [name: string]: Widget },
    ): boolean;

    export function computeDefaults<T = any>(
        schema: JSONSchema6,
        parentDefaults: Array<JSONSchema6["default"]>,
        definitions: FieldProps["registry"]["definitions"],
        rawFormData?: T,
        includeUndefinedValues?: boolean,
    ): Array<JSONSchema6["default"]>;

    export function getDefaultFormState<T = any>(
        schema: JSONSchema6,
        formData: T,
        definitions?: FieldProps["registry"]["definitions"],
        includeUndefinedValues?: boolean,
    ): T | Array<JSONSchema6["default"]>;

    export function getUiOptions(uiSchema: UiSchema): UiSchema["ui:options"];

    export function isObject(thing: any): boolean;

    export function mergeObjects(obj1: object, obj2: object, concatArrays?: boolean): object;

    export function asNumber(value: string | null): number | string | undefined | null;

    export function orderProperties(properties: [], order: []): [];

    export function isConstant(schema: JSONSchema6): boolean;

    export function toConstant(schema: JSONSchema6): JSONSchema6Type | JSONSchema6["const"] | Error;

    export function isSelect(_schema: JSONSchema6, definitions?: FieldProps["registry"]["definitions"]): boolean;

    export function isMultiSelect(schema: JSONSchema6, definitions?: FieldProps["registry"]["definitions"]): boolean;

    export function isFilesArray(
        schema: JSONSchema6,
        uiSchema: UiSchema,
        definitions?: FieldProps["registry"]["definitions"],
    ): boolean;

    export function isFixedItems(schema: JSONSchema6): boolean;

    export function allowAdditionalItems(schema: JSONSchema6): boolean;

    export function optionsList(schema: JSONSchema6): Array<{ label: string; value: string }>;

    export function guessType(value: any): JSONSchema6TypeName;

    export function stubExistingAdditionalProperties<T = any>(
        schema: JSONSchema6,
        definitions?: FieldProps["registry"]["definitions"],
        formData?: T,
    ): JSONSchema6;

    export function resolveSchema<T = any>(
        schema: JSONSchema6Definition,
        definitions?: FieldProps["registry"]["definitions"],
        formData?: T,
    ): JSONSchema6;

    export function retrieveSchema<T = any>(
        schema: JSONSchema6Definition,
        definitions?: FieldProps["registry"]["definitions"],
        formData?: T,
    ): JSONSchema6;

    export function deepEquals<T>(a: T, b: T): boolean;

    export function shouldRender(comp: React.Component, nextProps: any, nextState: any): boolean;

    export function toIdSchema<T = any>(
        schema: JSONSchema6Definition,
        id: string,
        definitions: FieldProps["registry"]["definitions"],
        formData?: T,
        idPredix?: string,
    ): IdSchema | IdSchema[];

    export function toPathSchema<T = any>(
        schema: JSONSchema6Definition,
        name: string | undefined,
        definitions: FieldProps["registry"]["definitions"],
        formData?: T,
    ): PathSchema | PathSchema[];

    export interface DateObject {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    }

    export function parseDateString(dateString: string, includeTime?: boolean): DateObject;

    export function toDateString(dateObject: DateObject, time?: boolean): string;

    export function pad(num: number, size: number): string;

    export function setState(instance: React.Component, state: any, callback: Function): void;

    export function dataURItoBlob(dataURI: string): { name: string; blob: Blob };

    export interface IRangeSpec {
        min?: number | undefined;
        max?: number | undefined;
        step?: number | undefined;
    }

    export function rangeSpec(schema: JSONSchema6): IRangeSpec;

    export function getMatchingOption(
        formData: any,
        options: JSONSchema6[],
        definitions: FieldProps["registry"]["definitions"],
    ): number;
}

declare module "react-jsonschema-form/lib/validate" {
    import { JSONSchema6Definition } from "json-schema";
    import { AjvError, ErrorSchema, FormProps } from "react-jsonschema-form";

    export default function validateFormData<T = any>(
        formData: T,
        schema: JSONSchema6Definition,
        customValidate?: FormProps<T>["validate"],
        transformErrors?: FormProps<T>["transformErrors"],
        additionalMetaSchemas?: FormProps<T>["additionalMetaSchemas"],
        customFormats?: FormProps<T>["customFormats"],
    ): { errors: AjvError[]; errorSchema: ErrorSchema };
}
