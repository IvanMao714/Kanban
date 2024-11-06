import { Slider, Backdrop, Fade, IconButton, Modal, Box, TextField, Typography, Divider } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React, { useEffect, useRef, useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Moment from 'moment'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import taskApi from '../../api/taskApi'

import '../../css/custom-editor.css'
import { red } from '@mui/material/colors'

const modalStyle = {
  outline: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '0px solid #000',
  boxShadow: 24,
  p: 1,
  height: '80%'
}

let timer
const timeout = 500
let isModalClosed = false

const TaskModal = props => {
  const boardId = props.boardId
  const [task, setTask] = useState(props.task)
  const [progress, setProgress] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const editorWrapperRef = useRef()
  console.log(task)

  useEffect(() => {
    setTask(props.task)
    setTitle(props.task !== undefined ? props.task.title : '')
    setContent(props.task !== undefined ? props.task.content : '')
    setProgress(props.task !== undefined ? props.task.progress : 0)
    if (props.task !== undefined) {
      isModalClosed = false

      updateEditorHeight()
    }
  }, [props.task])

  const updateEditorHeight = () => {
    setTimeout(() => {
      if (editorWrapperRef.current) {
        const box = editorWrapperRef.current
        box.querySelector('.ck-editor__editable_inline').style.height = (box.offsetHeight - 50) + 'px'
      }
    }, timeout)
  }

  const onClose = () => {
    isModalClosed = true
    props.onUpdate(task)
    props.onClose()
  }

  const deleteTask = async () => {
    try {
      await taskApi.delete(boardId, task.id)
      props.onDelete(task)
      setTask(undefined)
    } catch (err) {
      alert(err)
    }
  }

  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { title: newTitle })
      } catch (err) {
        alert(err)
      }
    }, timeout)

    task.title = newTitle
    setTitle(newTitle)
    props.onUpdate(task)
  }

  const updateContent = async (event, editor) => {
    clearTimeout(timer)
    const data = editor.getData()

    // console.log({ isModalClosed })

    if (!isModalClosed) {
      timer = setTimeout(async () => {
        try {
          await taskApi.update(boardId, task.id, { content: data })
        } catch (err) {
          alert(err)
        }
      }, timeout);

      task.content = data
      setContent(data)
      props.onUpdate(task)
    }
  }

  const updateDeadline = async (date) => {
    clearTimeout(timer)
    const newDeadline = Moment(date).format('YYYY-MM-DD')
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { deadline: newDeadline })
        console.log('update deadline')
      } catch (err) {
        alert(err)
      }
    }, timeout);
    task.deadline = newDeadline
    props.onUpdate(task)
  }

  const handleProgressChange = (event, newValue) => {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { progress: newValue })
      } catch (err) {
        alert(err)
      }
    }, timeout);
    task.progress = newValue
    setProgress(newValue)
    props.onUpdate(task)
  }


  return (
    <Modal
      open={task !== undefined}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={task !== undefined}>
        <Box sx={modalStyle}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%'
          }}>
            <IconButton variant='outlined' color='error' onClick={deleteTask}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'row',  // Change to row to split left and right sections
            }}
          >
            {/* Left Section */}
            <Box sx={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              padding: '2rem 5rem 5rem',
              width: '70%',  // Adjust width for the left section
            }}>
              {/* <Typography variant="subtitle1" fontWeight="700" sx={{ marginTop: '2rem' }}>
               Deadline
              </Typography> */}

              <TextField
                value={title}
                onChange={updateTitle}
                placeholder='Untitled'
                variant='outlined'
                fullWidth
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-input': { padding: 0 },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                  '& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' },
                  marginBottom: '10px'
                }}
              />
              <Typography variant='body2' fontWeight='700'>
                {task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
              </Typography>
              <Divider sx={{ margin: '1.5rem 0' }} />
              <Box
                ref={editorWrapperRef}
                sx={{
                  position: 'relative',
                  height: '80%',
                  overflowX: 'hidden',
                  overflowY: 'auto'
                }}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={content}
                  onChange={updateContent}
                  onFocus={updateEditorHeight}
                  onBlur={updateEditorHeight}
                  config={{
                    // 添加自定义样式
                    editor: {
                      body: {
                        backgroundColor: 'black',
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ margin: '0 1rem' }} />

            {/* Right Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 3rem',
                width: '30%', 
                background: red // Adjust width for the right section
              }}
            >
            <Typography variant="h6" fontWeight="700">
              Task Settings
            </Typography>
            <Typography variant="subtitle1" fontWeight="700" sx={{ marginTop: '2rem', marginBottom: '1rem' }}>
              Date Picker for Deadline
            </Typography>
             {/* Date Picker for Deadline */}
             <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Deadline"
                value={task !== undefined && task.deadline !== null? new Date(task.deadline) : null}
                onChange={(newDate) => {
                  const estDate = new Date(
                    newDate.toLocaleString("en-US", { timeZone: "America/New_York" })
                  );
                  console.log(estDate)
                  updateDeadline(estDate)}}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ marginTop: '1.5rem' }}/>}
              />
            </LocalizationProvider>

            {/* Slider for Progress */}
            <Typography variant="subtitle1" fontWeight="700" sx={{ marginTop: '2rem' }}>
              Progress: {progress}%
            </Typography>
            <Slider
              value={progress}
              onChange={handleProgressChange}
              aria-labelledby="progress-slider"
              valueLabelDisplay="auto"
              min={0}
              max={100}
              sx={{ marginTop: '1rem' }}
            />
            </Box>
          </Box>
          
        </Box>
      </Fade>
    </Modal>
    // <Fade in={task !== undefined} >
    //   <Box sx={modalStyle}>
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'flex-end',
    //         width: '100%',
    //       }}
    //     >
    //       <IconButton variant="outlined" color="error" onClick={deleteTask}>
    //         <DeleteOutlinedIcon />
    //       </IconButton>
    //     </Box>

    //     <Box
    //       sx={{
    //         display: 'flex',
    //         height: '100%',
    //         flexDirection: 'row',  // Change to row to split left and right sections
    //       }}
    //     >
    //       {/* Left Section */}
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           flexDirection: 'column',
    //           padding: '2rem 5rem 5rem',
    //           width: '70%',  // Adjust width for the left section
    //         }}
    //       >
    //         <TextField
    //           value={title}
    //           onChange={updateTitle}
    //           placeholder="Untitled"
    //           variant="outlined"
    //           fullWidth
    //           sx={{
    //             width: '100%',
    //             '& .MuiOutlinedInput-input': { padding: 0 },
    //             '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
    //             '& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' },
    //             marginBottom: '10px',
    //           }}
    //         />
    //         <Typography variant="body2" fontWeight="700">
    //           {task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
    //         </Typography>
    //         <Divider sx={{ margin: '1.5rem 0' }} />
    //         <Box
    //           ref={editorWrapperRef}
    //           sx={{
    //             position: 'relative',
    //             height: '80%',
    //             overflowX: 'hidden',
    //             overflowY: 'auto',
    //           }}
    //         >
    //           <CKEditor
    //             editor={ClassicEditor}
    //             data={content}
    //             onChange={updateContent}
    //             onFocus={updateEditorHeight}
    //             onBlur={updateEditorHeight}
    //           />
    //         </Box>
    //       </Box>

    //       {/* Divider */}
    //       <Divider orientation="vertical" flexItem sx={{ margin: '0 1rem' }} />

    //       {/* Right Section for additional features */}
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           flexDirection: 'column',
    //           padding: '2rem 3rem',
    //           width: '30%',  // Adjust width for the right section
    //         }}
    //       >
    //         <Typography variant="h6" fontWeight="700">
    //           Task Settings
    //         </Typography>
    //         {/* Progress Control */}
    //         <Box sx={{ marginTop: '1rem' }}>
    //           <Typography variant="subtitle1" fontWeight="700">
    //             Change Progress
    //           </Typography>
    //           {/* Example buttons or select menu for progress */}
    //           {/* <Button variant="outlined" onClick={changeProgress} sx={{ mt: 1 }}> */}
    //           <Button variant="outlined"  sx={{ mt: 1 }}>
    //             Set Progress
    //           </Button>
    //         </Box>

    //         {/* Tags Management */}
    //         <Box sx={{ marginTop: '2rem' }}>
    //           <Typography variant="subtitle1" fontWeight="700">
    //             Tags
    //           </Typography>
    //           {/* Example text field for adding tags */}
    //           {/* <TextField
    //             variant="outlined"
    //             placeholder="Add a tag"
    //             onKeyPress={addTag}
    //             sx={{ width: '100%', mt: 1 }}
    //           /> */}
    //           <TextField
    //             variant="outlined"
    //             placeholder="Add a tag"
    //             sx={{ width: '100%', mt: 1 }}
    //           />
    //           {/* Display tags if available */}
    //           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', mt: 1 }}>
    //             {/* {tags.map((tag) => (
    //               // <Chip key={tag} label={tag} onDelete={() => deleteTag(tag)} />
    //               <Chip key={tag} label={tag}  />
    //             ))} */}
    //           </Box>
    //         </Box>
    //       </Box>
    //     </Box>
    //   </Box>
    // </Fade>

  )
}
export default TaskModal