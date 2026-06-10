export const BUILDER_PROJECT_LIMIT = 3

export function emptyBuilderProject(role = 'developer') {
  return {
    title: '',
    description: '',
    category: '',
    stack: '',
    img1: '',
    img2: '',
    img3: '',
    live_url: '',
    repo_url: '',
    project_url: '',
  }
}

export function builderProjectToDb(project) {
  return {
    title: project.title?.trim() || '',
    description: project.description?.trim() || '',
    category: project.category?.trim() || '',
    stack: project.stack?.trim() || '',
    img1: project.img1 || '',
    img2: project.img2 || '',
    img3: project.img3 || '',
    live_url: project.live_url?.trim() || '',
    repo_url: project.repo_url?.trim() || '',
    project_url: project.project_url?.trim() || '',
  }
}

/** Map builder form projects → template localStorage shape */
export function builderProjectsToTemplateSeed(projects = [], role = 'developer') {
  return projects
    .filter((p) => p.title?.trim())
    .map((p, index) => {
      const base = {
        title: p.title.trim(),
        desc: p.description?.trim() || '',
        img1: p.img1 || '',
        img2: p.img2 || '',
        img3: p.img3 || '',
        id: Date.now() + index,
      }

      if (role === 'designer') {
        return {
          ...base,
          category: p.category?.trim() || '',
          projectUrl: p.project_url?.trim() || '',
        }
      }

      return {
        ...base,
        stack: p.stack?.trim() || '',
        liveUrl: p.live_url?.trim() || '',
        repoUrl: p.repo_url?.trim() || '',
      }
    })
}

export function storageKeyForTheme(themeId = '') {
  return `pf_${themeId.replace(/[^a-z0-9_-]/gi, '_')}`
}
