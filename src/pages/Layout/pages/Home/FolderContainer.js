import styled from "styled-components"

const FolderContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: ${props => props.flexDirection ?? "column"};
  justify-content: ${props => props.justifyContent ?? "center"};
  align-items: ${props => props.alignItems ?? "center"};
  width: ${props => props.width};
  height: ${props => props.height};
  border: ${props => `1px solid ${props.isSelected ? '#00a652' : '#f5f5f5'}`};
  background: white;
  box-shadow: 0.5px 0.5px 0.5px #f5f5f5;
  border-radius: ${props => props.borderRadius ?? "10px"};
  cursor: pointer;
  margin: ${props => props.margin ?? "0"};
  padding: ${props => props.padding ?? "0"};
  flex-shrink: 0;
  z-index:1
`

export default FolderContainer