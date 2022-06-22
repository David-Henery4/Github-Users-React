import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
//
const Repos = () => {
  const { githubRepos } = React.useContext(GithubContext);
  //
  const languages = githubRepos.reduce((total,item,i) => {
    const {language, stargazers_count} = item
    if (!language) return total // if falsey dont return anything.
    if (!total[language]){ // checks if already created on the object. (if already existes), if not create new property with a object containing the langauge label & value properties.
      total[language] = {label: language, value: 1, stars: stargazers_count};
    }
    else{ // if already existed, keep property and add the value.
      total[language] = {...total[language], value:  total[language].value + 1,
      stars: total[language].stars + 1}
    }
    // 
    // Now we have to put these objects in a array and return only the first five languages with the highest totals, using sort. (because we could return to many langauges)
    return total
  }, {})
  // console.log(languages)
  const mostUsed = Object.values(languages).sort((a,b)=> {
    return b.value - a.value;
  }).slice(0,5) // returns first five most popular langauges.
  //
  // (most stars per language) 
    const mostPopular = Object.values(languages).sort((a,b) => {
      return b.stars - a.stars
    }).map(item => {
      return {...item, value: item.stars}
    }).slice(0,5)
  //

  let {stars, forks} = githubRepos.reduce((total,item) => {
    const {stargazers_count,name, forks} = item;
    total.stars[stargazers_count] = {label: name, value: stargazers_count}
    total.forks[forks] = {label: name, value: forks}
    return total
  }, {stars:{}, forks:{}})

  stars = Object.values(stars).slice(-5).reverse()
  forks = Object.values(forks).slice(-5).reverse()
  

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsed}/>
        <Column3D data={stars}/>
        <Doughnut2D data={mostPopular}/>
        <Bar3D data={forks}/>
      </Wrapper>
    </section>
  );
};
/* <ExampleChart data={chartData}/> */

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
