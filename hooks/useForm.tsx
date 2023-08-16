import { AxiosResponse } from "axios"
import { ReactChild, useCallback, useState } from "react"

type Field = {
    label: string, 
    inputType: 'text' | 'password' | 'textarea',
    key: string
}
type FormOptions<T> = {
    initFormData: T,
    fields: Field[],
    buttons: ReactChild
    submit: {
        request: (formData: T) => Promise<AxiosResponse<T>>,
        message: string
    }
}

export function useForm<T>(options: FormOptions<T>){
    const {initFormData, fields, buttons, submit} = options

    const [formData, setFormData] = useState<T>(initFormData)
    const [errors, setErrors] = useState([])

    const handleOnChange = useCallback((key:string, value:any) => {
        setFormData({...formData, [key]: value})
      },[formData])

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        submit.request(formData).then(res => {
            window.alert(submit.message);
        }, (error) => {
            if (error.response) {
                const response: AxiosResponse = error.response;
                if (response.status === 422) {
                    setErrors(response.data);
                }
            }
        })
        
    },[formData, submit])

    const form =  <form onSubmit={handleSubmit}>
        {fields.map(field => 
            <div key={field.key}>
            <label>
                {field.label}
                {
                    field.inputType === 'textarea' ? 
                    <textarea cols={30} rows={10} onChange={(e) => handleOnChange(field.key, e.target.value)} />
                    :
                    <input type={field.inputType} onChange={(e) => handleOnChange(field.key, e.target.value)}/>
                }
                
            </label>
            {errors[field.key]?.length > 0 && <div>{errors[field.key].join(',')}</div>}
        </div> 
        )}
        <div>{buttons}</div>
    </form>

    return {
        form
    }
}