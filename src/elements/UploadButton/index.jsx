import React from 'react';
import { Upload } from 'antd';
import style from './style.module.scss';

const UploadButton = ({ value, onChange, name }) => {
    const handleUploadChange = ({ fileList }) => {
        // Pass the full fileList as-is — Ant Design already manages accumulation
        onChange(fileList);
    };

    return (
        <Upload
            name={name}
            fileList={value}
            onChange={handleUploadChange}
            beforeUpload={() => false}
            multiple
        >
            <button className={style.submitButton}>Add {name}</button>
        </Upload>
    );
};

export default UploadButton;