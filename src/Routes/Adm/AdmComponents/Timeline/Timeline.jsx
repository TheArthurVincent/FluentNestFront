import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { Paper, Typography, CircularProgress, Box } from "@mui/material";
import {
  backDomain,
  formatDate,
} from "../../../../Resources/UniversalComponents";

const TimelineComponent = (headers) => {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backDomain}/api/v1/timeline`, {
        headers,
      });
      console.log(response.data.timeline);
      const setT = response.data.timeline;
      setTimelineData(setT);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Timeline position="alternate">
      {timelineData.map((item) => (
        <TimelineItem key={item._id}>
          <TimelineOppositeContent color="text.secondary">
            {formatDate(new Date(item.date))}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} sx={{ padding: "6px 16px" }}>
              <Typography variant="h6" component="span">
                {item.type.toUpperCase()}
              </Typography>
              <Typography>{item.description}</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default TimelineComponent;
