import React, { useState } from 'react';
import {
    faPlus,
    faFileImport,
    faSave
} from '@fortawesome/free-solid-svg-icons';
import SimpleMDE from 'react-simplemde-editor';
import { v4 as uuidv4 } from 'uuid';
import { flattenArr, objToArr } from './utils/helper';
import fileHelper from './utils/fileHelper';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'easymde/dist/easymde.min.css';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import ButtonBtn from './components/BottonBtn';
import TabList from './components/TabList';
import defaultFile from './utils/defaultFiles';
// 不加window为commonjs
const fs = window.require('fs');
const path = window.require('path');
const { remote } = window.require('electron');
const Store = window.require('electron-store');
// 实例化
const fileStore = new Store({'name': 'Files Data'});


const saveFilesToStore = (files) => {
    const filesStoreObj = objToArr(files).reduce((result, file) => {
        const {id, path, title, createdAt} = file;
        result[id] = {
            id,
            path,
            title,
            createdAt
        }
        return result;
    }, {});
    fileStore.set('files', filesStoreObj)
}

function App() {
    const [files, setFiles] = useState(fileStore.get('files') || {});
    const [activeFileID, setActiveFileIDs] = useState('');
    const [openedFileIDs, setOpenedFileIDs] = useState([]);
    const [unsaveFileIDs, setUnsaveFileIDs] = useState([]);
    const [searchFiles, setSearchFiles] = useState([]);
    const filesArr = objToArr(files);
    const savedLocation = remote.app.getPath('documents');
    const openedFiles = openedFileIDs.map(openId => {
        return files[openId];
    });
    console.log(123, files);
    const activeFile = files[activeFileID];
    const fileListArr = searchFiles.length > 0 ? searchFiles : filesArr;

    const fileClick = fileID => {
        // set current active file
        setActiveFileIDs(fileID);
        const currentFile = files[fileID];
        if(!currentFile.isLoaded){
            fileHelper.readFile(currentFile.path).then(value => {
                const newFile = {...files[fileID], body: value, isLoaded: true}
                setFiles({...files, [fileID]: newFile})
            })
        }
        // if openedFiles don't have the current ID
        // add new fileID to openedFiles
        if (!openedFileIDs.includes(fileID)) {
            setOpenedFileIDs([...openedFileIDs, fileID]);
        }
    };

    const tabClick = fileID => {
        // set current active file
        setActiveFileIDs(fileID);
    };

    const tabClose = id => {
        // remove current id from openedFileID
        const tabsWithout = openedFileIDs.filter(fileID => fileID !== id);
        setOpenedFileIDs(tabsWithout);
        // set the active to the first opened tab if still tabs left
        if (tabsWithout.length > 0) {
            setActiveFileIDs(tabsWithout[0]);
        } else {
            setActiveFileIDs('');
        }
    };

    const fileChange = (id, value) => {
        const newFile = { ...files[id], body: value };
        setFiles({ ...files, [id]: newFile });
        // update unsaveIDs
        if (!unsaveFileIDs.includes(id)) {
            setUnsaveFileIDs([...unsaveFileIDs, id]);
        }
    };

    const deleteFile = id => {
       fileHelper.deleteFile(files[id].path).then(() => {
        delete files[id];
        setFiles(files);
        saveFilesToStore(files);
        // close the tab if opened
        tabClose(id);
       })
    };

    const updateFileName = (id, title, isNew) => {
        const newPath = path.join(savedLocation, `${title}.md`);
        const modifiedFile = { ...files[id], title, isNew: false, path: newPath};
        const newFiles = { ...files, [id]: modifiedFile }

        const repeatFileTitle = filesArr.find(file => file.title === title);

        if(repeatFileTitle){
            alert('存在同名文件')
            return ;
        }

        // 判断是不是新增的
        if (isNew) {


            fileHelper
                .writeFile(
                    newPath,
                    files[id].body
                )
                .then(() => {
                    setFiles(newFiles);
                    saveFilesToStore(newFiles);
                });
        } else {
            const oldPaht = path.join(savedLocation, `${files[id].title}.md`)
            // 重命名
            fileHelper
                .renameFile(
                    oldPaht,
                    newPath
                )
                .then(() => {
                    setFiles(newFiles);
                    saveFilesToStore(newFiles);
                });
        }
    };

    const fileSearch = keyword => {
        const newFiles = filesArr.filter(file => file.title.includes(keyword));
        setSearchFiles(newFiles);
    };

    const createNewFile = () => {
        const newId = uuidv4();
        const newFiles = {
            id: newId,
            title: '',
            body: '## 请输入 Markdown',
            createdAt: new Date().getTime(),
            isNew: true
        };
        setFiles({ ...files, [newId]: newFiles });
    };

    // document save
    const saveCurrentFile = () => {
        fileHelper
            .writeFile(
                // 在本地文件写入最新的数据
                path.join(savedLocation, `${activeFile.title}.md`),
                activeFile.body
            )
            .then(() => {
                // 在未保存的id中去掉该id
                setUnsaveFileIDs(
                    unsaveFileIDs.filter(id => id !== activeFile.id)
                );
            });
    };

    return (
        <div className='App container-fluid px-0'>
            <div className='row no-gutters'>
                <div className='col-3 bg-light left-panel'>
                    <FileSearch title='My Document' onFileSearch={fileSearch} />
                    <FileList
                        files={fileListArr}
                        onFileClick={fileClick}
                        onFileDelete={deleteFile}
                        onSaveEdit={updateFileName}
                    />
                    <div className='row no-gutters button-group'>
                        <div className='col'>
                            <ButtonBtn
                                text='新建'
                                colorClass='btn-primary'
                                icon={faPlus}
                                onBtnClick={createNewFile}
                            />
                        </div>
                        <div className='col'>
                            <ButtonBtn
                                text='导入'
                                colorClass='btn-success'
                                icon={faFileImport}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-9 right-panel'>
                    {!activeFile ? (
                        <div className='start-page'>
                            选择或者创建新的 Markdown 文档
                        </div>
                    ) : (
                        <>
                            <TabList
                                files={openedFiles}
                                activeId={activeFileID}
                                unsaveIds={unsaveFileIDs}
                                onTabClick={tabClick}
                                onCloseTab={tabClose}
                            />
                            <SimpleMDE
                                key={activeFile && activeFile.id}
                                value={activeFile && activeFile.body}
                                onChange={value => {
                                    fileChange(activeFile.id, value);
                                }}
                                options={{
                                    minHeight: '580px'
                                }}
                            />
                            <ButtonBtn
                                text='保存'
                                colorClass='btn-primary'
                                icon={faSave}
                                onBtnClick={saveCurrentFile}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
