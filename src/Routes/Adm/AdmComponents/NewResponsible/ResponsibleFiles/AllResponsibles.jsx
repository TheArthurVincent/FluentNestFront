import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  backDomain,
  isValidCPF,
} from "../../../../../Resources/UniversalComponents";
import { CircularProgress } from "@mui/material";
import { partnerColor } from "../../../../../Styles/Styles";
import { notifyAlert } from "../../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { HOne } from "../../../../../Resources/Components/RouteBox";

export function AllResponsibles({ headers, id, flag, setFlag }) {
  const [responsibles, setResponsibles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResponsibles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/responsibles/${id}`,
        { headers }
      );
      setResponsibles(response.data.responsibles || []);
    } catch (error) {
      notifyAlert(`Erro`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResponsibles();
  }, [flag]);
  return (
    <div>
      <button onClick={fetchResponsibles}>Carregar responsáveis</button>
      {loading && <CircularProgress />}
      {responsibles.map((resp) => (
        <div
          key={resp._id}
          style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}
        >
          <strong>
            {resp.name} {resp.lastname}
          </strong>{" "}
          ({resp.email})
          <div>
            <span>Alunos:</span>
            <ul>
              {resp.students && resp.students.length > 0 ? (
                resp.students.map((student) => (
                  <li key={student._id}>
                    {student.name} {student.lastname} - {student.email}
                  </li>
                ))
              ) : (
                <li>Nenhum aluno</li>
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllResponsibles;
