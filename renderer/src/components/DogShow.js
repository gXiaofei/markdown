import React, { useState, useEffect } from 'react';
import axios from 'axios';
// 使用自定义hooks
import useURLLoader from '../hooks/useURLLoader';
const DogShow = () => {
    // const [url, setUrl] = useState('');
    // const [loading, setLoading] = useState(false);
    // const [fetch, setFetch] = useState(false);
    // useEffect(() => {
    //     setLoading(true);
    //     axios.get('https://dog.ceo/api/breeds/image/random').then(result => {
    //         console.log(result);
    //         setUrl(result.data.message);
    //         setLoading(false);
    //     });
    // }, [fetch]);
    const [data, loading] = useURLLoader(
        'https://dog.ceo/api/breeds/image/random'
    );
    return (
        <>
            {loading ? <p>🐕读取中</p> : <img src={data && data.message} alt='' />}
            <button
                onClick={() => {
                    // setFetch(!fetch);
                }}
            >
                再查看一张
            </button>
        </>
    );
};

export default DogShow;
