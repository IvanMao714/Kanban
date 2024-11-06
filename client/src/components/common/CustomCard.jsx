import React from 'react';
import { Typography, Box, LinearProgress, Avatar } from '@mui/material';
import { differenceInDays, parseISO } from 'date-fns';

const CustomCard = React.forwardRef(
    ({ task, isDragging, onClick, ...providedProps }, ref) => {
        // 解析并计算与当前日期的时间差
        console.log("task:"+task.deadline);
        const deadline = task.deadline ? parseISO(task.deadline) : null;
        const daysUntilDeadline = deadline ? differenceInDays(deadline, new Date()) : null;

        // 字体颜色：小于一周为红色，否则为黑色
        const deadlineColor = daysUntilDeadline !== null && daysUntilDeadline <= 7 ? 'red' : 'white';

        // 根据 task.flag 设置对应的图像 URL
        const getImageByFlag = (flag) => {
            switch (flag) {
                case 'completed':
                    return '/images/completed.png'; // 假设有一张图片
                case 'error':
                    return '/images/error.png';
                case 'warning':
                    return '/images/warning.png';
                case 'info':
                    return '/public/images/info.png';
                default:
                    return '/public/logo192.png';
                    // return null;
            }
        };

        const flagImage = getImageByFlag(task.flag);

        return (
            <Box
                ref={ref}
                {...providedProps}
                sx={{
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#808080',
                    position: 'relative', // 设置为相对定位以便放置右上角图像
                    boxShadow: isDragging
                        ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                        : '0 2px 5px rgba(0, 0, 0, 0.1)',
                    cursor: isDragging ? 'grab' : 'pointer',
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    '&:hover': {
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        transform: 'translateY(-2px)',
                    },
                }}
                onClick={onClick}
            >
                {/* 右上角图像 */}
                {flagImage && (
                    <Box sx={{ display: 'flex', gap: '4px' }}>
                        {task.flags && task.flags.length > 0 && task.flags.map((flag, index) => (
                            <Avatar
                                key={index}
                                src={'../../public/logo192.png'} // 获取每个 flag 对应的图像 URL
                                sx={{ width: 20, height: 20 }}
                                alt={flag}
                            />
                        ))}
                    </Box>
                
                
                )}

                {/* 标题 */}
                <Typography sx={{ fontWeight: 'bold', paddingBottom: '10px' }}>
                    {task.title === '' ? 'Untitled' : task.title}
                </Typography>

                {/* 进度条 */}
                <Box sx={{ marginBottom: '8px' }}>
                    <LinearProgress
                        variant="determinate"
                        value={task.progress || 0} // 假设进度为百分比
                        sx={{
                            height: '4px', // 更细的进度条
                            borderRadius: '2px',
                            backgroundColor: '#ddd',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#4caf50', // 自定义进度条颜色
                            },
                        }}
                    />
                </Box>

                {/* 时间、进度和执行人 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* 左侧：时间 */}
                    <Typography
                        variant="body2"
                        color={deadlineColor}
                        sx={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                        }}
                    >
                        {task.deadline? new Date(task.deadline).toDateString():''}
                    </Typography>

                    {/* 右侧：进度和执行人 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Typography variant="body2">
                            {task.progress || 0}%
                        </Typography>
                        <Avatar src={task.assigneeAvatar} alt={task.assigneeName}
                            sx={{ width: '24px', height: '24px' }} />
                    </Box>
                </Box>
            </Box>
        );
    }
);

export default CustomCard;
