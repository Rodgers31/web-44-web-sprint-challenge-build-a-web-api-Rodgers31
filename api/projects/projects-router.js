// Write your "projects" router here!
const express = require('express');
const Project = require('./projects-model');
const { validateProjectId, validateProject } = require('./projects-middleware');

const router = express.Router();

//`[GET] /api/projects`

router.get('/', async (req, res, next) => {
	try {
		const projects = await Project.get();
		res.status(200).json(projects);
	} catch (error) {
		next(error);
	}
});

//`[GET] /api/projects/:id`

router.get('/:id', validateProjectId, (req, res, next) => {
	try {
		res.json(req.project);
	} catch (error) {
		next(error);
	}
});

//`[POST] /api/projects`
router.post('/', validateProject, async (req, res, next) => {
	try {
		const newProject = await Project.insert({
			name: req.name,
			description: req.description,
			completed: req.completed,
		});
		res.status(201).json(newProject);
	} catch (error) {
		next(error);
	}
});
//`[PUT] /api/projects/:id`
router.put('/:id', validateProjectId, validateProject, (req, res, next) => {
	Project.update(req.params.id, {
		name: req.name,
		description: req.description,
		completed: req.completed,
	})
		.then(() => {
			return Project.get(req.params.id);
		})
		.then((project) => {
			res.json(project);
		})
		.catch(next);
});

//`[DELETE] /api/projects/:id`
router.delete('/:id', validateProjectId, async (req, res, next) => {
	try {
		await Project.remove(req.params.id);
		res.json(res.Project);
	} catch (error) {
		next(error);
	}
});
//`[GET] /api/projects/:id/actions`
router.get('/:id/actions', validateProjectId, async (req, res, next) => {
	Project.getProjectActions(req.params.id)
		.then((actions) => {
			if (actions.length > 0) {
				res.status(200).json(actions);
			} else {
				res.status(404).json(actions);
			}
		})
		.catch(next);
});
module.exports = router;
