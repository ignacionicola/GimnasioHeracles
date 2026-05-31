import React from "react";
import styled from "styled-components";

const InformeCard = ({ title, value, description, imgSrc, icon }) => {
  return (
    <StyledWrapper>
      <div className="informe-card">
        <div className="informe-card__icon">
          {imgSrc ? <img src={imgSrc} alt={title} /> : icon}
        </div>
        <div className="informe-card__title">{title}</div>
        <div className="informe-card__value">{value}</div>
        <div className="informe-card__description">{description}</div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  height: 100%;

  .informe-card {
    width: 100%;
    height: 100%;
    min-height: 160px;
    background: rgba(8, 12, 24, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 24px;
    padding: 1.5rem 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    text-align: center;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    margin-top: 1.75rem;
  }

  .informe-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(93, 95, 239, 0.2);
    border-color: rgba(93, 95, 239, 0.3);
  }

  .informe-card__icon {
    width: 58px;
    height: 58px;
    flex-shrink: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, #5d5fef, #38bdf8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 1.3rem;
    margin-bottom: 4px;
  }

  .informe-card__icon img {
    width: 26px;
    height: 26px;
    object-fit: contain;
  }

  .informe-card__title {
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
  }

  .informe-card__value {
    font-size: 1.9rem;
    font-weight: 700;
    color: #f7f9fc;
    line-height: 1.1;
  }

  .informe-card__description {
    font-size: 0.95rem;
    color: #c5cee0;
    line-height: 1.4;
    margin-top: 2px;
    padding-top: 2px;
  }
`;

export default InformeCard;
