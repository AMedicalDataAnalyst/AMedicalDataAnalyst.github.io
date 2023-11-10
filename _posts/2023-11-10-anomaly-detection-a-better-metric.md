---
layout: post
title: 'Anomaly detection: a better metric'
date: 2023-11-08
categories: ["Anomaly detection", "Model metrics"]
tags: ["Anomaly detection", "Prevalence"]
math: true
---

Anomaly detection is a really very interesting field, especially in image analysis. However, I feel that it is necessary to draw attention to the limitations of the commonly used Area Under the Curve (AUC) metric. ([papers with code leaderboard](https://paperswithcode.com/task/anomaly-detection), [Anomalib's leaderboard](https://github.com/openvinotoolkit/anomalib)). Though  AUC provides a standardised measure which has the advantage of being [reproducible](https://en.wikipedia.org/wiki/Reproducibility), it does not reveal true performance on imbalanced datasets. In fact, you can have an AUC that is as high as 0.99 and still have a model that is useless for your application. This depends strongly on the [prevalence](https://en.wikipedia.org/wiki/Prevalence) of the anomaly class in your dataset. The lower the prevalence, the more likely it is that the AUC will be misleading.

Authors should consider reporting sensitivity and specificity alongside the prevalence of the anomaly class in their datasets. The first two metrics are reproducible, and an estimate of the last can often be obtained for any given dataset. These three metrics, when provided, enable the calculation of the false positive to true positive ratio, a key indicator of a model's performance on imbalanced datasets. After all, for imbalanced data, unless a model is completely flawed the issue is most likely to be an abundance of false positives which will have to be sifted through. The formula for this ratio is expressed as follows:

$$
\frac{FP}{TP} = \frac{(1-Prevalence)(1-Sensitivity)}{Prevalence \times Specificity}
$$

with the values being fractions not percentages. 

Here is a plot of expected behaviour for values of sensitivity and specificity of 0.9 and above- one can see that as the prevalence gets lower the sensitivity and specificity must improve significantly in order to achieve a decent performance. In particular a very high sensitivity is key for low prevalence datasets. In fact, for a prevalence of 0.001 (or one in one thousand) a sensitivity of 0.99 will only achieve a FP/TP ratio of 10. A whopping sensitivity of 0.999 is required to achieve a false positive to true positive ratio of 1. Not many modern methods can yet achieve this for the subtle problems of anomaly detection.

![Plot showing how the false positive to true positive ratio changes with prevalence, sensitivity and specificity](/assets/img/AnomalyDetection/fp_tp_curve_0.9_light.png){: width="700" height="400" .light }

![Plot showing how the false positive to true positive ratio changes with prevalence, sensitivity and specificity](/assets/img/AnomalyDetection/fp_tp_curve_0.9_dark.png){: width="700" height="400" .dark }
