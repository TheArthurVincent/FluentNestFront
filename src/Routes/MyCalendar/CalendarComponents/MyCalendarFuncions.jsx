// Function to convert video URLs to embed URLs
export const getEmbedUrl = (url) => {
  if (!url) return null;

  // YouTube URL patterns
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Vimeo URL patterns
  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${videoId}`;
  }

  // If it's already an embed URL or other format, return as is
  return url;
};

// File handling functions
export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      const base64Data = base64String.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const formattedDates = (dateString) => {
  const date = new Date(dateString);
  date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
  return new Date(date);
};

export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const times = [
  "6:00",
  "6:15",
  "6:30",
  "6:45",

  "7:00",
  "7:15",
  "7:30",
  "7:45",

  "8:00",
  "8:15",
  "8:30",
  "8:45",

  "9:00",
  "9:15",
  "9:30",
  "9:45",

  "10:00",
  "10:15",
  "10:30",
  "10:45",

  "11:00",
  "11:15",
  "11:30",
  "11:45",

  "12:00",
  "12:15",
  "12:30",
  "12:45",

  "13:00",
  "13:15",
  "13:30",
  "13:45",

  "14:00",
  "14:15",
  "14:30",
  "14:45",

  "15:00",
  "15:15",
  "15:30",
  "15:45",

  "16:00",
  "16:15",
  "16:30",
  "16:45",

  "17:00",
  "17:15",
  "17:30",
  "17:45",

  "18:00",
  "18:15",
  "18:30",
  "18:45",

  "19:00",
  "19:15",
  "19:30",
  "19:45",

  "20:00",
  "20:15",
  "20:30",
  "20:45",

  "21:00",
  "21:15",
  "21:30",
  "21:45",

  "22:00",
  "22:15",
  "22:30",
  "22:45",
];

export function newFormatDate(date) {
  let d = new Date(date);
  d.setDate(d.getDate() + 1); // Aumenta um dia na data
  let day = String(d.getDate()).padStart(2, "0");
  let month = String(d.getMonth() + 1).padStart(2, "0"); // Janeiro é 0!
  let year = d.getFullYear();
  let final = `${day}/${month}/${year}`;
  return final;
}

