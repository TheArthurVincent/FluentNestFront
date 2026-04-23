import React, { FC, useEffect, useState } from "react";
import { BooksIcon } from "@phosphor-icons/react";
import { backDomain } from "../../../Resources/UniversalComponents";
import axios from "axios";

interface RecommendedMaterialsProps {
  appLoaded?: boolean;
  actualHeaders?: any;
  isDesktop?: boolean;
  studentId?: string;
}

export const RecommendedMaterials: FC<RecommendedMaterialsProps> = ({
  appLoaded,
  actualHeaders,
  isDesktop,
  studentId,
}) => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ====== GET recommended classes ======
  const seeLessons = async () => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/recommended-classes/${studentId}`,
        {
          headers: actualHeaders ? { ...actualHeaders } : {},
        }
      );

      setLessons(response.data.lessons || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    seeLessons();
  }, [appLoaded, actualHeaders, studentId]);

  const styleLi = {
    fontFamily: "Lato",
    fontWeight: 600,
    fontSize: "13px",
    lineHeight: "22px",
    color: "#65748C",
  } as React.CSSProperties;

  return (
    !loading && (
      <>
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              fontWeight: "600",
              color: "#030303",
            }}
          >
            <BooksIcon size={20} color={"#030303"} weight="bold" />
            <span>Materiais a Revisar</span>
          </span>
        </span>

        <div>
          <ul style={{ marginTop: "20px" }}>
            {lessons.map((item, index) => (
              <li key={index} style={{ ...styleLi }}>
                <a
                  href={`/teaching-materials/${item.courseId}/${item._id}`}
                  style={{ textDecoration: "none", color: "#65748C" }}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  );
};
