import { NextPage } from "next";
import { useForm } from "hooks/useForm";

type FormDataType = {
    title: string;
    content: string;
}

const PostsNew:NextPage = () => {


    const {form} = useForm<FormDataType>({
        initFormData: {
            title: '',
            content: ''
        },
        fields: [
            {label: '标题', inputType: 'text', key: 'title'},
            {label: '内容', inputType: 'textarea', key: 'content'},
        ],
        buttons: <button>提交</button>
    })

    return (
        <div>{form}</div>
    )
}

export default PostsNew