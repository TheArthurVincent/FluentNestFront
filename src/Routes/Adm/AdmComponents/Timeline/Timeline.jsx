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
import { partnerColor } from "../../../../Styles/Styles";

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
        <CircularProgress style={{ color: partnerColor() }} />
      </Box>
    );
  }

  return (
    <div className="timeline">
      {timelineData.map((item) => (
        <div className="timeline-item" key={item._id}>
          <div className="timeline-date">{formatDate(new Date(item.date))}</div>
          <div className="timeline-marker">
            <div className={`dot ${item.type}`} />
            <div className="line" />
          </div>
          <div className="timeline-content">
            <h3 className="type">{item.type.toUpperCase()}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineComponent;
