import emotionStyled, { CreateStyled } from "@emotion/styled";

const styled: typeof emotionStyled = (component, options) => {
  const CreateStyledComponent = emotionStyled(component, options);
  return CreateStyledComponent;
};

export default styled;
