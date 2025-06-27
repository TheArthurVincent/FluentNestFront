import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  CircularProgress,
  Modal,
  TextField,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { HOne } from "../../../../Resources/Components/RouteBox";
import { secondaryColor } from "../../../../Styles/Styles";

export function AllComments({ headers }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [responseText, setResponseText] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/nonansweredcomments`,
        { headers }
      );
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Erro ao buscar comentários", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleOpenModal = (comment) => {
    setSelectedComment(comment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setResponseText("");
  };

  const deleteComment = async (id) => {
    try {
      await axios.delete(`${backDomain}/api/v1/comment/${id}`, { headers });
      window.alert("Comentário excluído!");
      fetchComments();
    } catch (error) {
      console.log(error, "Erro ao excluir comentário");
    }
  };

  const handleSubmitResponse = async () => {
    try {
      await axios.post(
        `${backDomain}/api/v1/commentreply/${selectedComment.id}`,
        { response: responseText, student: selectedComment },
        { headers }
      );
      handleCloseModal();
      fetchComments();
    } catch (error) {
      console.error("Erro ao enviar resposta", error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <HOne>Comentários Pendentes</HOne>
      {loading ? (
        <CircularProgress style={{ color: secondaryColor() }} />
      ) : (
        comments.map((comment, index) => (
          <Paper key={index} sx={{ padding: 2, marginBottom: 2 }} elevation={3}>
            <Typography variant="h6">{comment.name}</Typography>
            <Typography variant="body1" sx={{ padding: "1rem 0" }}>
              {comment.comment}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                color="error"
                variant="contained"
                sx={{ marginTop: 1 }}
                onDoubleClick={() => deleteComment(comment.id)}
              >
                Clique duas vezes para rejeitar
              </Button>
              <Button
                variant="contained"
                sx={{ marginTop: 1 }}
                onClick={() => handleOpenModal(comment)}
              >
                Responder
              </Button>
            </Box>
          </Paper>
        ))
      )}

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            background: "white",
            padding: 3,
            borderRadius: "6px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Responder Comentário
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: secondaryColor() },
                "&:hover fieldset": { borderColor: secondaryColor() },
                "&.Mui-focused fieldset": {
                  borderColor: secondaryColor(),
                },
              },
              "& label": { color: secondaryColor() },
              "& label.Mui-focused": { color: secondaryColor() },
            }}
            variant="outlined"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
          />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
          >
            <Button onClick={handleCloseModal} sx={{ marginRight: 1 }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSubmitResponse}>
              Enviar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default AllComments;
