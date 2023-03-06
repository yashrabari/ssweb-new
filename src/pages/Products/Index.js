import React from "react";
import {
  Back,
  Container,
  Page,
  Row,
  Title,
  Paragraph,
} from "../../components/common";
import Section from "./Section";

const Index = () => {
  return (
    <Page>
      <Container
        width="-webkit-fill-available"
        margin="69px"
        justifyContent="flex-start"
      >
        <Title fontWeight="700" margin="46px auto 0">
          Products (Plans and Support Services)
        </Title>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "-webkit-fill-available",
          }}
          className="flex_column"
        >
          <Section
            textAlign="start"
            color="#000"
            width="-webkit-fill-available"
            display="block"
          >
            <ul>
              <Paragraph textAlign="start" color="#000" fontSize="30px">
                Plan A
              </Paragraph>
              <li className="mt-15">5Gb Space</li>
              <li>4 Buddies</li>
              <li> $6.99/month</li>
              OR
              <br />
              <li>$71.00/annually (15% discount for annual subscription)</li>
            </ul>
          </Section>
          <Section
            textAlign="start"
            color="#000"
            width="-webkit-fill-available"
            display="block"
          >
            <ul>
              <Paragraph textAlign="start" color="#000" fontSize="30px">
                Plan B
              </Paragraph>
              <li className="mt-15"> 10Gb Space</li>
              <li> 7 Buddies</li>
              <li> $9.99/month</li>
              OR
              <br />
              <li> $99.00/annually (17% discount for annual subscription)</li>
            </ul>
          </Section>
          <Section
            textAlign="start"
            color="#000"
            width="-webkit-fill-available"
            display="block"
          >
            <ul>
              <Paragraph color="#000" fontSize="30px">
                Plan C
              </Paragraph>
              <li className="mt-15"> 15Gb Space</li>
              <li> $14.99/month</li>
              <li> 10 Buddies</li>
              OR
              <br />
              <li>$135/annually (25% discount for annual subscription)</li>
            </ul>
          </Section>
        </div>
        <Back />
      </Container>
    </Page>
  );
};

export default Index;
