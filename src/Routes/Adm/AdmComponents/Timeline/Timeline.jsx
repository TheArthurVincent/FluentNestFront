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
import { Paper, Typography, CircularProgress } from "@mui/material";
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
      <div style={{display: "flex", justifyContent: "center"}}>
        <CircularProgress style={{ color: partnerColor() }} />
      </div>
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
