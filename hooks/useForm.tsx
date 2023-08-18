import { AxiosResponse } from 'axios';
import { ReactChild, useCallback, useState } from 'react';
import cs from 'classnames';

type Field<T> = {
  label: string;
  inputType: 'text' | 'password' | 'textarea';
  key: keyof T;
  className?: string;
};
type Sumbit<T> = {
  request: (formData: T) => Promise<AxiosResponse<T>>;
  message?: string;
  success?: () => void;
};
type FormOptions<T> = {
  initFormData: T;
  fields: Field<T>[];
  buttons: ReactChild;
  submit: Sumbit<T>;
};

export function useForm<T>(options: FormOptions<T>) {
  const { initFormData, fields, buttons, submit } = options;
  const [formData, setFormData] = useState(initFormData);

  const initErrors = () => {
    // const errors = {
    //     username: ['错误1','错误2'],
    //     password: ['错误1','错误2']
    // }
    const e: { [k in keyof T]?: string[] } = {};
    for (let key in initFormData) {
      if (initFormData.hasOwnProperty(key)) {
        e[key] = [];
      }
    }
    return e;
  };
  const [errors, setErrors] = useState(initErrors);

  const handleChange = useCallback(
    (key: string, value: string) => {
      setFormData({ ...formData, [key]: value });
    },
    [formData],
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      setErrors(initErrors);

      submit.request(formData).then(
        (res) => {
          window.alert(submit.message || '操作成功');
          submit.success?.();
        },
        (error) => {
          if (error.response) {
            const response: AxiosResponse = error.response;
            if (response.status === 422) {
              setErrors(response.data);
            }
            if (response.status === 401) {
              window.alert(response.data.message);
              window.location.href = `/login?return_to=${encodeURIComponent(
                window.location.pathname,
              )}`;
            }
          }
        },
      );
    },
    [formData, submit],
  );

  const form = (
    <form onSubmit={handleSubmit} className="form">
      {fields.map((field) => (
        <div
          key={field.key.toString()}
          className={cs('field', `field-${field.key.toString()}`, field.className)}
        >
          <label className="label">
            <span className="label-text">{field.label}</span>
            {field.inputType === 'textarea' ? (
              <textarea
                className="control"
                cols={30}
                rows={10}
                onChange={(e) => handleChange(field.key.toString(), e.target.value)}
                value={formData[field.key].toString()}
              />
            ) : (
              <input
                className="control"
                type={field.inputType}
                onChange={(e) => handleChange(field.key.toString(), e.target.value)}
                value={formData[field.key].toString()}
              />
            )}
          </label>
          {errors[field.key]?.length > 0 && <div>{errors[field.key].join(',')}</div>}
        </div>
      ))}
      <div className="action">{buttons}</div>

      <style jsx>{`
        .field {
          margin: 8px 0;
        }
        .label {
          display: flex;
          line-height: 32px;
        }
        .label input {
          height: 32px;
        }
        .label > .label-text {
          white-space: nowrap;
          margin-right: 1em;
          width: 6em;
          text-align: right;
        }
        .label > .control {
          width: 100%;
        }
        .action {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      <style jsx global>
        {`
          button {
            margin: 6px;
          }
        `}
      </style>
    </form>
  );

  return {
    form,
    setFormData,
  };
}
