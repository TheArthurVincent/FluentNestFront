import React, { useState, useEffect } from "react";
import axios from "axios";
import { HOne } from "../../../../Resources/Components/RouteBox";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { Button, CircularProgress, Input, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import { partnerColor } from "../../../../Styles/Styles";
import { HThree } from "../../../MyClasses/MyClasses.Styled";

export function AllClasses({ headers }) {
  const [tutorings, setTutorings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setSeeDelete = (id) => {
    setDeleteId(id);
    setIsModalOpen(!isModalOpen);
  };
  const seeAllTutorings = async () => {
    setLoading(true);
    try {
      var response = await axios.get(`${backDomain}/api/v1/tutoring`, {
        headers,
      });
      if (response) {
        setTutorings(response.data.formattedTutoringsByStudent);
      } else {
        console.error(
          "Invalid response structure: pastTutorings or futureTutorings is undefined"
        );
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Erro ao listar vídeo aulas");
      window.location.assign("/login");
      setLoading(false);
    }
  };

  useEffect(() => {
    seeAllTutorings();
  }, []);

  async function deleteTutoring(tutoringID) {
    try {
      const response = await axios.delete(
        `${backDomain}/api/v1/tutoring/${tutoringID}`,
        { headers }
      );
      alert(`Aula com ID ${tutoringID} excluída`);
      seeAllTutorings();
      setIsModalOpen(!isModalOpen);
    } catch (error) {
      alert(`Erro ao excluir aula com ID ${tutoringID}: ${error}`);
      seeAllTutorings();
      setIsModalOpen(!isModalOpen);
    }
  }

  const filteredTutorings = tutorings.filter((group) =>
    group.student.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <HOne>Aulas gravadas</HOne>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Delete Class"
      >
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <p>Are you sure you want to delete this class?</p>
          <Button onClick={() => setIsModalOpen(false)}>No</Button>
          <Button onClick={() => deleteTutoring(deleteId)}>Yes</Button>
        </div>
      </Modal>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={() => seeAllTutorings()}>
          <i className="fa fa-refresh" aria-hidden="true" />
        </Button>
        <span>
          <Input
            style={{
              margin: "1rem",
            }}
            type="text"
            placeholder="Buscar por nome do aluno"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />{" "}
          <i className="fa fa-search" aria-hidden="true" />
        </span>
      </div>
      <div style={{ maxHeight: "30rem", overflow: "auto" }}>
        {loading ? (
          <CircularProgress style={{ color: partnerColor() }} />
        ) : (
          filteredTutorings.map((group, index) => (
            <div key={index}>
              <HThree>{`Student: ${group.student.name}`}</HThree>
              {group.tutorings.map((tutoring) => (
                <div
                  style={{
                    padding: "1rem",
                  }}
                  key={tutoring.id}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <Link target="_blank" to={tutoring.videoUrl}>
                      {tutoring.date} - Veja a aula
                    </Link>
                    <Button onClick={() => setSeeDelete(tutoring.id)}>
                      Apagar aula
                    </Button>
                  </div>
                  <div
                    style={{
                      padding: "1rem",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: tutoring.comments }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default AllClasses;
