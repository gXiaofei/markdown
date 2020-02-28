import React, { useState } from 'react';

// 文件搜索
const FileSearch = ({ title, onFileSearch }) => {
    const [inputActive, setinputActive] = useState(false);
    const [value, setValue] = useState('');

    return (
        <div className='alert alert-primary'>
            <div className='row d-flex justify-content-between align-items-center'>
                {inputActive ? (
                    <input
                        autoFocus
                        value={value}
                        className='form-control col-8'
                        onChange={e => {
                            setValue(e.target.value);
                        }}
                    />
                ) : (
                    <span>{title}</span>
                )}
                <button
                    type='button'
                    className='btn btn-primary col-4'
                    onClick={() => {
                        setinputActive(!inputActive);
                    }}
                >
                    {inputActive ? '关闭' : '搜索'}
                </button>
            </div>
        </div>
    );
};

export default FileSearch;
