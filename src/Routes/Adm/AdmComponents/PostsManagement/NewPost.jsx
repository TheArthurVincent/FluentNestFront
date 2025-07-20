import React, { useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { HOne } from "../../../../Resources/Components/RouteBox";
import { partnerColor, textTitleFont } from "../../../../Styles/Styles";
import { ArvinButton } from "../../../../Resources/Components/ItemsLibrary";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";

export function NewPost({ headers }) {
  const [newTitle, setNewTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newImg, setNewImg] = useState("");
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Nenhum");

  const handleChooseOption = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    let newPost = {
      title: newTitle,
      videoUrl: newVideoUrl,
      img: newImg,
      text: newText,
    };
    try {
      const { id } = JSON.parse(localStorage.getItem("loggedIn"));
      await axios.post(`${backDomain}/api/v1/blogposts/${id}`, newPost, {
        headers,
      });
      notifyAlert("Post criado com sucesso!", "green");
      window.location.href = "/";
      setLoading(false);
    } catch (error) {
      notifyAlert(error.response.data.message, "red");
      console.error("Error creating post:", error);
      setLoading(false);
    }
  };

  return loading ? (
    <CircularProgress style={{ color: partnerColor() }} />
  ) : (
    <div style={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <HOne
        style={{
          fontFamily: textTitleFont(),
          color: partnerColor(),
        }}
      >
        Nova Postagem
      </HOne>
      <Paper sx={{ padding: 3 }} elevation={3}>
        <form
          style={{
            display: "grid",
            gap: "1rem",
            fontFamily: textTitleFont(),
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Novo Título"
            fullWidth
            variant="outlined"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <Typography variant="body1">
            Quer adicionar uma imagem/vídeo?
          </Typography>
          <Select
            fullWidth
            value={selectedOption}
            onChange={handleChooseOption}
          >
            <MenuItem value="Vídeo">Vídeo</MenuItem>
            <MenuItem value="Imagem">Imagem</MenuItem>
            <MenuItem value="Nenhum">Nenhum</MenuItem>
          </Select>
          {selectedOption === "Imagem" && (
            <TextField
              label="Nova Imagem (OPCIONAL)"
              fullWidth
              variant="outlined"
              value={newImg}
              onChange={(e) => setNewImg(e.target.value)}
            />
          )}
          {selectedOption === "Vídeo" && (
            <TextField
              label="Novo Vídeo do YouTube/Vimeo (OPCIONAL)"
              fullWidth
              variant="outlined"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
            />
          )}
          <TextField
            label="Texto"
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            required
          />
          <span
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <ArvinButton color={partnerColor()} type="submit">
              Criar
            </ArvinButton>
          </span>
        </form>
      </Paper>
    </div>
  );
}

export default NewPost;
