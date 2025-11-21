import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../Resources/UniversalComponents";

type EventProps = {
  headers: MyHeadersType;
  isDesktop?: boolean;
};

const Event: FC<EventProps> = ({ headers, isDesktop }) => {
  const { eventId } = useParams<{ eventId: string }>();

  const [eventData, setEventData] = useState(null);

  const fetchEventData = async () => {
    if (!eventId) return;
    try {
      const res = await axios.get(`${backDomain}/api/v1/event/${eventId}`, {
        headers: headers as any,
      });
      setEventData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching event data", err);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  return (
    <div
      style={{
        margin: isDesktop ? "0px 16px 0px 0px" : "0px",
        padding: isDesktop ? 0 : 8,
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {isDesktop && `eventId: ${eventId}`}

      <div
        style={{
          fontFamily:
            "Plus Jakarta Sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          display: "grid",
          gridTemplateColumns: isDesktop
            ? "repeat(3, minmax(0, 1fr))"
            : "minmax(0, 1fr)",
          gap: isDesktop ? 24 : 16,
          alignItems: "flex-start",
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {eventId}
      </div>
    </div>
  );
};

export default Event;
