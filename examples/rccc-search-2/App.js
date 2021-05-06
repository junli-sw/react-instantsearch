/* eslint-disable-file react/jsx-no-target-blank */
import React, { useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import styled from "styled-components";
import { convertToTraditionalChinese } from "zh_cn_zh_tw";
import "./App.css";
import Card, { CardSection } from "@kiwicom/orbit-components/lib/Card";
import List, { ListItem } from "@kiwicom/orbit-components/lib/List";
import InputField from "@kiwicom/orbit-components/lib/InputField";
import Pagination from "@kiwicom/orbit-components/lib/Pagination";
import Search from "@kiwicom/orbit-components/lib/icons/Search";
import Illustration from "@kiwicom/orbit-components/lib/Illustration";
import AlgoliaSearch from "./algolia-blue-mark.svg";

const PER_PAGE = 10;

const Body = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  padding: 0 16px;
  flex-grow: 2;
`;

const AlertWrapper = styled.div`
  padding: 26px 0;
  color: #70757a;
`;

const Results = styled.div`
  padding: 16px 0;
  display: flex;
  flex-wrap: wrap;

  content-visibility: auto;
  contain-intrinsic-size: 1000px; /* Explained in the next section. */

  & > * {
    margin: 10px 10px 10px 0;
    width: 100%;
  }
`;

const EmptyResults = styled.div`
  display: flex;

  justify-content: center;
`;

const ResultTitle = styled.div`
  min-height: 30px;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;

  display: flex;
  justify-content: space-between;

  & > a {
    font-weight: bold;
    text-decoration: none;
  }
  & > span > a {
    text-decoration: none;
  }
`;

const ResultBody = styled.div`
  min-height: 80px;
`;

const HighlightResult = styled.p`
  margin: 0;

  & em {
    background-color: yellow;
    font-style: normal;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;

  background: #2c3e50;
  padding: 5px 24px;

  & > a {
    display: block;
  }

  & > a img {
    display: block;
    height: 37px;
  }

  @media only screen and (min-width: 768px) {
    & > a img {
      height: 65px;
    }
  }
`;

const FooterWrapper = styled.div`
  margin-top: 40px;
  background: #2c3e50;
`;

const Footer = styled.div`
  color: rgba(255, 255, 255, 0.66);
  line-height: 48px;
  padding: 24px 0;
  text-align: center;

  & > address {
    font-style: normal;
  }
`;

const FooterName = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #bbb;
`;

const FooterLink = styled.a`
  color: #fff;
  text-decoration: none;
`;

const SearchSuffix = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 12px;
`;

const HeaderWrapper = styled.div`
  background: linear-gradient(0deg, #f5f5f5, #fff);
  margin-bottom: 24px;
`;

const Header = styled.div`
  color: #333;
  padding: 0 24px;
`;

const AppTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 600;

  @media only screen and (min-width: 768px) {
    font-size: 24px;
  }

  & a {
    color: #333;
    text-decoration: none;
    display: block;

    line-height: 60px;
    @media only screen and (min-width: 768px) {
      line-height: 80px;
    }

    &:hover {
      color: #0d5661;
      transition: all 0.3s;
    }
  }
`;

function getQueryFromPage() {
  if (window.location.search.length > 0) {
    const q = new URLSearchParams(window.location.search);
    console.log(q);

    return q.get("s");
  } else {
    return "";
  }
}

function App() {
  const [keyword, setKeyword] = useState(getQueryFromPage());
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (keyword.length > 0) {
      fetch(
        `/.netlify/functions/search?s=${convertToTraditionalChinese(keyword)}`
      ).then(async res => {
        const newItems = await res.json();
        console.log("setItems", newItems);
        setItems(newItems);
      });
    } else {
      setItems([]);
    }
  }, [keyword, setItems]);

  return (
    <Body>
      <HeaderWrapper>
        <LogoWrapper>
          <a href="https://cn.rccc.org/" aria-label="Link">
            <img
              alt="Rutgers Community Christian Church"
              src="./rccc-logo-sm.png"
              srcSet="./rccc-logo-sm.png 300w, ./rccc-logo-lg.png 600w"
              sizes="(max-width: 768px) 300px, 600px"
            />
          </a>
        </LogoWrapper>
        <Header>
          <AppTitle>
            <a href="/">若歌教會全站搜索引擎</a>
          </AppTitle>
        </Header>
      </HeaderWrapper>
      <Content>
        <InputField
          prefix={<Search />}
          suffix={
            <SearchSuffix
              src={AlgoliaSearch}
              title="Search powered by Algolia"
            />
          }
          value={keyword}
          onChange={evt => {
            setKeyword(evt.target.value);
            setPage(1);
          }}
          placeholder="輸入關鍵字"
        />
        {items.length > 0 && (
          <AlertWrapper>根據關鍵字找到{items.length}條匹配記錄</AlertWrapper>
        )}

        {items.length > 0 && (
          <Pagination
            pageCount={Math.ceil(items.length / PER_PAGE)}
            selectedPage={page}
            onPageChange={page => {
              setPage(page);
              window.scrollTo(0, 0);
            }}
          />
        )}

        <Results>
          {items.slice((page - 1) * PER_PAGE, page * PER_PAGE).map(item => (
            <ResultCard
              keyword={convertToTraditionalChinese(keyword)}
              {...item}
            />
          ))}
        </Results>

        {items.length === 0 && (
          <EmptyResults>
            <Illustration name="Help" />
          </EmptyResults>
        )}

        {items.length > 0 && (
          <Pagination
            pageCount={Math.ceil(items.length / PER_PAGE)}
            selectedPage={page}
            onPageChange={page => {
              setPage(page);
              window.scrollTo(0, 0);
            }}
          />
        )}
      </Content>
      <FooterWrapper>
        <Footer>
          <FooterName>Rutgers Community Christian Church</FooterName>
          <address>
            <FooterLink href="https://goo.gl/maps/gwqqUJcwFYLiFsy56">
              71 Cedar Grove Lane Somerset, NJ 08873
            </FooterLink>
          </address>
          <div>
            <FooterLink href="tel:+1-732-868-6700">+1-732-868-6700</FooterLink>
          </div>
          © {new Date().getFullYear()} Rutgers Community Christian Church{" "}
          <FooterLink href="https://drive.google.com/file/d/1gTyEgwgfRI1mKF4-4Y1POsKgCJLyQ2kn/view">
            隱私條款
          </FooterLink>
        </Footer>
      </FooterWrapper>
    </Body>
  );
}

function ResultCard({ type, keyword, ...attrs }) {
  if (type === "SON") {
    const {
      title,
      speaker,
      scripture,
      congregation,
      date,
      recordingLink
    } = attrs;

    return (
      <Card>
        <CardSection>
          <ResultTitle>
            <a href={recordingLink} target="_blank" rel="noopener">
              {highlight(title, keyword)}
            </a>{" "}
            <span>
              {date} [
              <a href="http://www.rccc.org/Sermon/home" target="_blank" rel="noopener">
                講道庫
              </a>
              ]
            </span>
          </ResultTitle>
          <ResultBody>
            <List>
              <ListItem>{highlight(scripture, keyword)}</ListItem>
              <ListItem>{highlight(speaker, keyword)}</ListItem>
              <ListItem>{congregation}</ListItem>
            </List>
          </ResultBody>
        </CardSection>
      </Card>
    );
  } else {
    const { topicName, title, date, link, _highlightResult } = attrs;

    const source = (topicName || type).toLowerCase();

    return (
      <Card>
        <CardSection>
          <ResultTitle>
            <a href={link} target="_blank" rel="noopener">
              {highlight(title, keyword)}
            </a>
            <span>
              {date && `${date} `}[
              {isLink(source) ? (
                <a href={`https://${source}`} target="_blank" rel="noopener">
                  {getFriendlyName(source)}
                </a>
              ) : (
                source
              )}
              ]
            </span>
          </ResultTitle>
          <ResultBody>
            <HighlightResult
              dangerouslySetInnerHTML={{
                __html: _highlightResult.content?.value
              }}
            />
          </ResultBody>
        </CardSection>
      </Card>
    );
  }
}

function isLink(source) {
  return source.endsWith(".rccc.org");
}

function getFriendlyName(source) {
  if (source === "school.rccc.org") {
    return "主日學";
  }

  if (source === "cn.rccc.org") {
    return "中文主站";
  }

  if (source === "en.rccc.org") {
    return "英文主站";
  }

  if (source === "rbsg.rccc.org") {
    return "若歌學生查經班";
  }

  return source;
}

function highlight(content, keyword) {
  return (
    <Highlighter
      highlightClassName="keyword"
      searchWords={keyword.split(" ")}
      autoEscape={true}
      textToHighlight={content}
    />
  );
}

export default App;
