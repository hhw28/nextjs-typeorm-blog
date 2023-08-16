import { AxiosResponse } from "axios";
import { ReactChild, useCallback, useState } from "react";

type Field<T> = {
  label: string;
  inputType: "text" | "password" | "textarea";
  key: keyof T;
};
type FormOptions<T> = {
  initFormData: T;
  fields: Field<T>[];
  buttons: ReactChild;
  submit: {
    request: (formData: T) => Promise<AxiosResponse<T>>;
    message: string;
  };
};

export function useForm<T>(options: FormOptions<T>) {
  const { initFormData, fields, buttons, submit } = options;

  const [formData, setFormData] = useState<T>(initFormData);
  const [errors, setErrors] = useState(() => {
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
  });

  const handleChange = useCallback(
    (key: string, value: string) => {
      setFormData({ ...formData, [key]: value });
    },
    [formData]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      submit.request(formData).then(
        (res) => {
          window.alert(submit.message);
        },
        (error) => {
          if (error.response) {
            const response: AxiosResponse = error.response;
            if (response.status === 422) {
              setErrors(response.data);
            }
          }
        }
      );
    },
    [formData, submit]
  );

  const form = (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.key.toString()}>
          <label>
            {field.label}
            {field.inputType === "textarea" ? (
              <textarea
                cols={30}
                rows={10}
                onChange={(e) =>
                  handleChange(field.key.toString(), e.target.value)
                }
              />
            ) : (
              <input
                type={field.inputType}
                onChange={(e) =>
                  handleChange(field.key.toString(), e.target.value)
                }
              />
            )}
          </label>
          {errors[field.key]?.length > 0 && (
            <div>{errors[field.key].join(",")}</div>
          )}
        </div>
      ))}
      <div>{buttons}</div>
    </form>
  );

  return {
    form,
  };
}
