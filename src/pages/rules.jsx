import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import rules from '@site/src/data/rules.generated.json';

export default function Rules() {
  return (
    <Layout title="Rules (English)" description="Automatically reviewable rules of the Vilnius dev standard in English (non-binding)">
      <main className="container margin-vert--lg">
        <h1>Dev standard rules (English)</h1>
        <p>
          The automatically reviewable rules of the standard, in English, as used by AI agents and code review.
          This translation is <strong>not binding</strong>: the Lithuanian text shown under each rule, and the linked section, is the binding version.
        </p>
        {rules.map((rule) => (
          <section key={rule.id} id={rule.anchorId} className="margin-bottom--lg">
            <h3 className="margin-bottom--xs">
              <a href={`#${rule.anchorId}`}>{rule.id}</a>{' '}
              <small>{rule.level} · {rule.stacks.join(', ')}</small>
            </h3>
            <p className="margin-bottom--xs">
              {rule.en ?? <em>English text pending.</em>}
              {rule.draft && <em> (unreviewed machine translation)</em>}
            </p>
            <p lang="lt" className="margin-bottom--none">
              <small>
                {rule.lt} (<Link to={`${rule.route}#${rule.anchor}`}>{rule.heading || 'šaltinis'}</Link>)
              </small>
            </p>
          </section>
        ))}
      </main>
    </Layout>
  );
}
