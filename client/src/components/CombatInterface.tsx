import { type ReactNode, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Heart, Shield, Sparkles, Swords, Zap } from "lucide-react";
import mutatorBattleUrl from "@assets/mutator_battle_cutout.png";

interface CombatAbility {
  name: string;
  cost: number;
  damage: number;
  description: string;
  kind: "strike" | "arcane" | "heal" | "guard";
  target: "enemy" | "self";
}

interface CombatEntity {
  id: string;
  name: string;
  portraitUrl?: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  speed: number;
  type: "ally" | "enemy";
  abilities: CombatAbility[];
}

interface CombatInterfaceProps {
  allies: CombatEntity[];
  enemies: CombatEntity[];
  currentTurn: string;
  onAction: (action: string, targetId?: string) => void;
  onEscape: () => void;
  onPartyUpdate?: (allies: CombatEntity[]) => void;
  onVictory?: (experienceGained: number) => void;
}

type Command = "attack" | "skill" | "item" | "guard";
type BattlePhase = "player" | "enemy" | "victory" | "defeat";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function CombatInterface({
  allies,
  enemies,
  currentTurn,
  onAction,
  onEscape,
  onPartyUpdate,
  onVictory,
}: CombatInterfaceProps) {
  const [party, setParty] = useState(() => allies);
  const [foes, setFoes] = useState(() => enemies);
  const [phase, setPhase] = useState<BattlePhase>("player");
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<CombatAbility | null>(null);
  const [message, setMessage] = useState("戦闘開始！ 変な気配がこちらを見ている。");
  const [battleLog, setBattleLog] = useState<string[]>(["敵が現れた！"]);
  const [guarding, setGuarding] = useState(false);
  const guardingRef = useRef(false);
  const [itemCount, setItemCount] = useState(2);
  const [impactTarget, setImpactTarget] = useState<string | null>(null);
  const [damagePopup, setDamagePopup] = useState<{ targetId: string; text: string; tone: "damage" | "heal" } | null>(null);
  const experienceReward = useMemo(
    () => enemies.reduce((total, enemy) => total + Math.max(20, Math.floor(enemy.maxHealth * 0.75)), 0),
    [enemies],
  );

  const updateParty = (nextParty: CombatEntity[]) => {
    setParty(nextParty);
    onPartyUpdate?.(nextParty);
  };

  const activeAlly = useMemo(
    () => party.find((ally) => ally.id === currentTurn) ?? party[0],
    [party, currentTurn],
  );
  const livingFoes = foes.filter((enemy) => enemy.health > 0);
  const livingParty = party.filter((ally) => ally.health > 0);

  const pushLog = (line: string) => {
    setBattleLog((current) => [line, ...current].slice(0, 5));
  };

  const flashTarget = (targetId: string, text: string, tone: "damage" | "heal" = "damage") => {
    setImpactTarget(targetId);
    setDamagePopup({ targetId, text, tone });
    window.setTimeout(() => setImpactTarget(null), 520);
    window.setTimeout(() => setDamagePopup(null), 1200);
  };

  const finishPlayerTurn = (nextFoes: CombatEntity[], line: string) => {
    setSelectedCommand(null);
    setSelectedAbility(null);
    setMessage(line);
    pushLog(line);

    if (nextFoes.every((enemy) => enemy.health <= 0)) {
      setPhase("victory");
      setMessage(`勝利！ EXPを${experienceReward}獲得！`);
      pushLog(`勝利した！ EXP +${experienceReward}`);
      return;
    }

    setPhase("enemy");
    window.setTimeout(() => {
      setMessage("敵が体勢を立て直している...");
    }, 650);
    window.setTimeout(() => runEnemyTurn(nextFoes), 1450);
  };

  const runEnemyTurn = (currentFoes: CombatEntity[]) => {
    const attacker = currentFoes.find((enemy) => enemy.health > 0);
    const target = activeAlly;

    if (!attacker || !target || target.health <= 0) {
      setPhase("player");
      return;
    }

    const baseDamage = 8 + Math.floor(attacker.speed / 14);
    const isGuarding = guardingRef.current;
    const damage = isGuarding ? Math.ceil(baseDamage * 0.45) : baseDamage;
    const line = isGuarding
      ? `${attacker.name}の突進！ 防御して${damage}ダメージに抑えた。`
      : `${attacker.name}の突進！ ${target.name}に${damage}ダメージ！`;

    const nextParty = party.map((ally) =>
      ally.id === target.id
        ? { ...ally, health: clamp(ally.health - damage, 0, ally.maxHealth) }
        : ally,
    );

    updateParty(nextParty);
    guardingRef.current = false;
    setGuarding(false);
    flashTarget(target.id, `-${damage}`);
    pushLog(line);
    setMessage(line);

    if (nextParty.every((ally) => ally.health <= 0)) {
      setPhase("defeat");
      setMessage("敗北... 体勢を立て直す必要がある。");
      pushLog("全員が倒れた。");
      return;
    }

    window.setTimeout(() => {
      setPhase("player");
      setMessage("こちらの番だ。コマンドを選ぼう。");
    }, 900);
  };

  const handleTargetSelect = (targetId: string) => {
    if (phase !== "player" || !activeAlly) return;

    const target = foes.find((enemy) => enemy.id === targetId);
    if (!target || target.health <= 0) return;

    if (selectedCommand === "attack") {
      const damage = 18 + Math.floor(activeAlly.speed / 10);
      const nextFoes = foes.map((enemy) =>
        enemy.id === targetId
          ? { ...enemy, health: clamp(enemy.health - damage, 0, enemy.maxHealth) }
          : enemy,
      );
      setFoes(nextFoes);
      flashTarget(targetId, `-${damage}`);
      onAction("attack", targetId);
      finishPlayerTurn(nextFoes, `${activeAlly.name}の通常攻撃！ ${target.name}に${damage}ダメージ！`);
      return;
    }

    if (selectedCommand === "skill" && selectedAbility) {
      if (selectedAbility.cost > activeAlly.mana) {
        setMessage("MPが足りない！");
        return;
      }

      const typeBonus = selectedAbility.kind === "arcane" ? 8 : 0;
      const damage = selectedAbility.damage + typeBonus + Math.floor(activeAlly.speed / 12);
      const nextParty = party.map((ally) =>
        ally.id === activeAlly.id ? { ...ally, mana: ally.mana - selectedAbility.cost } : ally,
      );
      const nextFoes = foes.map((enemy) =>
        enemy.id === targetId
          ? { ...enemy, health: clamp(enemy.health - damage, 0, enemy.maxHealth) }
          : enemy,
      );

      updateParty(nextParty);
      setFoes(nextFoes);
      flashTarget(targetId, `-${damage}`);
      onAction(selectedAbility.name, targetId);
      finishPlayerTurn(nextFoes, `${activeAlly.name}の「${selectedAbility.name}」！ ${damage}ダメージ！`);
    }
  };

  const handleSkillSelect = (ability: CombatAbility) => {
    if (!activeAlly) return;

    if (ability.cost > activeAlly.mana) {
      setMessage("MPが足りない！");
      return;
    }

    if (ability.target === "self") {
      handleSelfSkill(ability);
      return;
    }

    setSelectedCommand("skill");
    setSelectedAbility(ability);
    setMessage(`「${ability.name}」のターゲットを選択！`);
  };

  const handleSelfSkill = (ability: CombatAbility) => {
    if (!activeAlly) return;

    const nextParty = party.map((ally) => {
      if (ally.id !== activeAlly.id) return ally;

      if (ability.kind === "heal") {
        return {
          ...ally,
          mana: ally.mana - ability.cost,
          health: clamp(ally.health + ability.damage, 0, ally.maxHealth),
        };
      }

      return {
        ...ally,
        mana: ally.mana - ability.cost,
      };
    });

    updateParty(nextParty);
    setSelectedCommand(null);
    setSelectedAbility(null);

    if (ability.kind === "heal") {
      flashTarget(activeAlly.id, `+${ability.damage}`, "heal");
      finishPlayerTurn(foes, `${activeAlly.name}の「${ability.name}」！ HPが${ability.damage}回復！`);
      return;
    }

    guardingRef.current = true;
    setGuarding(true);
    finishPlayerTurn(foes, `${activeAlly.name}の「${ability.name}」！ 次のダメージを大きく軽減する！`);
  };

  const handleItemUse = () => {
    if (!activeAlly || itemCount <= 0) {
      setMessage("使える回復アイテムがない！");
      return;
    }

    const heal = 36;
    const nextParty = party.map((ally) =>
      ally.id === activeAlly.id
        ? { ...ally, health: clamp(ally.health + heal, 0, ally.maxHealth) }
        : ally,
    );

    updateParty(nextParty);
    setItemCount((count) => count - 1);
    flashTarget(activeAlly.id, `+${heal}`, "heal");
    finishPlayerTurn(foes, `${activeAlly.name}は応急パックを使った。HPが${heal}回復！`);
  };

  const handleGuard = () => {
    if (!activeAlly) return;
    guardingRef.current = true;
    setGuarding(true);
    finishPlayerTurn(foes, `${activeAlly.name}は身構えた。次のダメージを軽減する！`);
  };

  const resetBattle = () => {
    setParty(allies);
    setFoes(enemies);
    setPhase("player");
    setSelectedCommand(null);
    setSelectedAbility(null);
    setMessage("再戦開始！ 今度は押し切ろう。");
    setBattleLog(["仕切り直した！"]);
    guardingRef.current = false;
    setGuarding(false);
    setItemCount(2);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#12141a] text-white">
      <div className="relative min-h-screen bg-[radial-gradient(circle_at_50%_12%,rgba(225,88,255,0.22),transparent_28%),linear-gradient(180deg,#20222b_0%,#11131a_58%,#08090d_100%)]">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-fuchsia-500/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-36 h-40 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_80px)] opacity-30" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.28em] text-fuchsia-300">Ruin Burst Battle</div>
              <h1 className="text-2xl font-black">ハイスピード戦闘</h1>
            </div>
            <Button
              onClick={onEscape}
              variant="ghost"
              className="border border-white/15 bg-white/5 text-white hover:bg-white/10"
              data-testid="command-escape"
            >
              <ArrowLeft className="w-4 h-4" />
              戻る
            </Button>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-4 py-4 lg:grid-cols-[280px_minmax(520px,1fr)_340px]">
            <aside className="space-y-3">
              <div className="rounded-md border border-fuchsia-300/30 bg-black/35 p-3 shadow-[0_0_24px_rgba(217,70,239,0.15)]">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-fuchsia-200">
                  <Sparkles className="w-4 h-4" />
                  PARTY
                </div>
                <div className="space-y-3">
                  {party.map((ally) => (
                    <div
                      key={ally.id}
                      className={`rounded-md border p-3 transition ${
                        impactTarget === ally.id
                          ? "border-cyan-300 bg-cyan-300/15"
                          : "border-white/10 bg-white/[0.04]"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-fuchsia-300/40">
                          <AvatarImage src={ally.portraitUrl} alt={ally.name} />
                          <AvatarFallback>{ally.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold">{ally.name}</div>
                          <div className="text-xs text-fuchsia-200">{phase === "player" ? "COMMAND READY" : "WAIT"}</div>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="mb-1 flex justify-between">
                            <span>HP</span>
                            <span>{ally.health}/{ally.maxHealth}</span>
                          </div>
                          <Progress value={(ally.health / ally.maxHealth) * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="mb-1 flex justify-between">
                            <span>MP</span>
                            <span>{ally.mana}/{ally.maxMana}</span>
                          </div>
                          <Progress value={(ally.mana / ally.maxMana) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-white/10 bg-black/30 p-3">
                <div className="mb-2 text-xs font-bold text-white/60">BATTLE LOG</div>
                <div className="space-y-2 text-xs text-white/75">
                  {battleLog.map((line, index) => (
                    <div key={`${line}-${index}`} className="border-l-2 border-fuchsia-300/50 pl-2">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <main className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black/20 p-5">
              <div className="absolute left-6 top-5 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                {phase === "player" && "PLAYER TURN"}
                {phase === "enemy" && "ENEMY TURN"}
                {phase === "victory" && "VICTORY"}
                {phase === "defeat" && "DEFEAT"}
              </div>

              <div className="grid w-full grid-cols-1 items-end gap-6 md:grid-cols-[0.85fr_1.15fr]">
                <div className="flex justify-center md:justify-end">
                  {livingParty.map((ally) => (
                    <div key={ally.id} className="relative">
                      <div className="absolute -inset-7 rounded-full bg-cyan-300/10 blur-xl" />
                      {damagePopup?.targetId === ally.id && (
                        <div className={`absolute -top-10 left-1/2 z-20 -translate-x-1/2 text-3xl font-black drop-shadow-lg ${
                          damagePopup.tone === "heal" ? "text-emerald-300" : "text-red-300"
                        }`}>
                          {damagePopup.text}
                        </div>
                      )}
                      <Avatar className={`relative h-36 w-36 border-4 border-cyan-200/50 bg-slate-900 transition ${impactTarget === ally.id ? "scale-95 brightness-150" : ""}`}>
                        <AvatarImage src={ally.portraitUrl} alt={ally.name} />
                        <AvatarFallback className="text-4xl">{ally.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="mt-4 text-center text-sm font-bold text-cyan-100">{ally.name}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center md:justify-start">
                  {foes.map((enemy) => (
                    <button
                      key={enemy.id}
                      type="button"
                      disabled={phase !== "player" || enemy.health <= 0 || (!selectedAbility && selectedCommand !== "attack")}
                      onClick={() => handleTargetSelect(enemy.id)}
                      className={`group relative rounded-md border p-4 text-left transition ${
                        enemy.health <= 0
                          ? "border-white/10 bg-white/5 opacity-40"
                          : "border-red-300/40 bg-red-950/25 hover:scale-105 hover:border-red-200"
                      } ${impactTarget === enemy.id ? "scale-110 bg-red-500/25" : ""}`}
                      data-testid={`target-${enemy.id}`}
                    >
                      <div className="absolute -inset-4 rounded-full bg-red-500/15 blur-2xl transition group-hover:bg-red-400/25" />
                      <div className="relative flex h-80 w-64 items-center justify-center overflow-hidden rounded-md border border-cyan-200/25 bg-gradient-to-br from-cyan-950/50 via-zinc-950 to-black">
                        <img
                          src={mutatorBattleUrl}
                          alt={enemy.name}
                          className={`h-full w-full object-contain object-center drop-shadow-[0_0_22px_rgba(34,211,238,0.35)] transition ${
                            impactTarget === enemy.id ? "scale-95 brightness-150 saturate-150" : "group-hover:scale-105"
                          }`}
                        />
                      </div>
                      <div className="relative mt-4 w-64">
                        {damagePopup?.targetId === enemy.id && (
                          <div className="absolute -top-12 left-1/2 z-20 -translate-x-1/2 text-4xl font-black text-yellow-200 drop-shadow-lg">
                            {damagePopup.text}
                          </div>
                        )}
                        <div className="mb-1 truncate text-center text-sm font-black">{enemy.name}</div>
                        <Progress value={(enemy.health / enemy.maxHealth) * 100} className="h-2" />
                        <div className="mt-1 text-center text-xs text-white/70">{enemy.health}/{enemy.maxHealth}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </main>

            <aside className="flex flex-col gap-3">
              <div className="rounded-md border-2 border-fuchsia-300/40 bg-black/50 p-4 shadow-[0_0_30px_rgba(217,70,239,0.22)]">
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-200">Message</div>
                <div className="min-h-20 text-lg font-bold leading-relaxed" data-testid="combat-message">
                  {message}
                </div>
              </div>

              {phase === "player" && activeAlly && (
                <div className="rounded-md border border-white/10 bg-black/35 p-3">
                  {!selectedCommand && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={() => setSelectedCommand("attack")} className="h-14 bg-fuchsia-600 text-white hover:bg-fuchsia-500" data-testid="command-attack">
                        <Swords className="w-4 h-4" />
                        たたかう
                      </Button>
                      <Button onClick={() => setSelectedCommand("skill")} className="h-14 bg-cyan-600 text-white hover:bg-cyan-500" data-testid="command-skill">
                        <Zap className="w-4 h-4" />
                        スキル
                      </Button>
                      <Button onClick={() => setSelectedCommand("item")} className="h-14 bg-emerald-600 text-white hover:bg-emerald-500" data-testid="command-item">
                        <Heart className="w-4 h-4" />
                        アイテム
                      </Button>
                      <Button onClick={handleGuard} className="h-14 bg-amber-600 text-white hover:bg-amber-500" data-testid="command-guard">
                        <Shield className="w-4 h-4" />
                        ガード
                      </Button>
                    </div>
                  )}

                  {selectedCommand === "attack" && (
                    <CommandPanel title="攻撃対象を選択" onBack={() => setSelectedCommand(null)}>
                      敵をクリックして通常攻撃。安定したダメージを与える。
                    </CommandPanel>
                  )}

                  {selectedCommand === "skill" && (
                    <div className="space-y-2">
                      <PanelHeader title="スキル" onBack={() => setSelectedCommand(null)} />
                      {activeAlly.abilities.map((ability) => (
                        <Button
                          key={ability.name}
                          onClick={() => handleSkillSelect(ability)}
                          disabled={ability.cost > activeAlly.mana}
                          className="h-auto w-full justify-between bg-white/10 p-3 text-left text-white hover:bg-white/15"
                          data-testid={`ability-${ability.name}`}
                        >
                          <span>
                            <span className="mb-1 flex items-center gap-2 font-bold">
                              <span className={`rounded px-1.5 py-0.5 text-[10px] ${getAbilityKindClass(ability.kind)}`}>
                                {getAbilityKindLabel(ability.kind)}
                              </span>
                              {ability.name}
                            </span>
                            <span className="block text-xs text-white/60">{ability.description}</span>
                          </span>
                          <span className="text-cyan-200">MP {ability.cost}</span>
                        </Button>
                      ))}
                    </div>
                  )}

                  {selectedCommand === "item" && (
                    <div className="space-y-2">
                      <PanelHeader title="アイテム" onBack={() => setSelectedCommand(null)} />
                      <Button onClick={handleItemUse} disabled={itemCount <= 0} className="h-auto w-full justify-between bg-emerald-600 p-3 text-white hover:bg-emerald-500">
                        <span>
                          <span className="block font-bold">応急パック</span>
                          <span className="block text-xs text-white/70">HPを36回復する</span>
                        </span>
                        <span>x{itemCount}</span>
                      </Button>
                    </div>
                  )}

                  {selectedAbility && (
                    <div className="mt-3 rounded-md border border-cyan-300/30 bg-cyan-300/10 p-3 text-sm text-cyan-100">
                      敵をクリックして「{selectedAbility.name}」を発動。
                    </div>
                  )}
                </div>
              )}

              {(phase === "victory" || phase === "defeat") && (
                <div className="grid grid-cols-2 gap-2 rounded-md border border-white/10 bg-black/35 p-3">
                  <Button onClick={resetBattle} className="bg-fuchsia-600 text-white hover:bg-fuchsia-500">
                    再戦
                  </Button>
                  <Button
                    onClick={() => phase === "victory" ? onVictory?.(experienceReward) : onEscape()}
                    variant="outline"
                    className="text-white"
                  >
                    {phase === "victory" ? "経験値を受け取る" : "戻る"}
                  </Button>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="font-bold text-fuchsia-200">{title}</div>
      <Button onClick={onBack} variant="ghost" size="sm" className="text-white/70">
        戻る
      </Button>
    </div>
  );
}

function CommandPanel({ title, children, onBack }: { title: string; children: ReactNode; onBack: () => void }) {
  return (
    <div>
      <PanelHeader title={title} onBack={onBack} />
      <div className="rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white/70">{children}</div>
    </div>
  );
}

function getAbilityKindLabel(kind: CombatAbility["kind"]) {
  switch (kind) {
    case "strike":
      return "斬撃";
    case "arcane":
      return "異能";
    case "heal":
      return "回復";
    case "guard":
      return "防御";
  }
}

function getAbilityKindClass(kind: CombatAbility["kind"]) {
  switch (kind) {
    case "strike":
      return "bg-fuchsia-500/25 text-fuchsia-100";
    case "arcane":
      return "bg-cyan-500/25 text-cyan-100";
    case "heal":
      return "bg-emerald-500/25 text-emerald-100";
    case "guard":
      return "bg-amber-500/25 text-amber-100";
  }
}
